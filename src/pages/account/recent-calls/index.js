import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components/macro";
import DatePicker from "antd/lib/date-picker";
import { NotificationDispatchContext } from "../../../contexts/NotificationContext";
import InternalMain from "../../../components/wrappers/InternalMain";
import Section from "../../../components/blocks/Section";
import TableContent from "../../../components/blocks/TableContent";
import AntdTable from "../../../components/blocks/AntdTable";
import phoneNumberFormat from "../../../helpers/phoneNumberFormat";
import timeFormat from "../../../helpers/timeFormat";
import Radio from "../../../components/elements/Radio";
import InputGroup from "../../../components/elements/InputGroup";
import Button from "../../../components/elements/Button";
import Checkbox from "../../../components/elements/Checkbox";

const { RangePicker } = DatePicker;
const Directions = [
  {
    label: "Inbound",
    value: "inbound",
  },
  {
    label: "Outbound",
    value: "outbound",
  },
];
const DateFilters = [
  {
    label: "Last 7 days",
    value: "seven",
  },
  {
    label: "Last 14 days",
    value: "fourteen",
  },
  {
    label: "Last 30 days",
    value: "thirty",
  },
  {
    label: "Custom",
    value: "custom",
  },
];

const DateFilterContainer = styled.div`
  padding: 1rem;
  width: 280px;
`;

const DirectionFilterContainer = styled.div`
  padding: 1rem;
`;

const DateFilterIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const DateFilterValue = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.12);
  background: #bfbfbf;
  color: #fff !important;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RecentCallsIndex = () => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem("jwt");
  const account_sid = localStorage.getItem("account_sid");

  // Table props
  const [recentCallsData, setRecentCallsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter values
  const [attemptedAt, setAttemptedAt] = useState("-");
  const [dirFilter, setDirFilter] = useState("-");

  //=============================================================================
  // Define Table props
  //=============================================================================
  const getFilterProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <DateFilterContainer>
        {DateFilters.map((date) => (
          <Radio
            noLeftMargin
            key={date.value}
            id={date.value}
            label={date.label}
            checked={selectedKeys.includes(date.value)}
            onChange={(e) =>
              setSelectedKeys(e.target.checked ? [date.value] : [])
            }
          />
        ))}
        {selectedKeys.includes("custom") && <RangePicker size="small" />}
        <InputGroup flexEnd space>
          <Button text gray onClick={clearFilters}>
            Reset
          </Button>
          <Button
            text
            onClick={() => {
              setAttemptedAt(selectedKeys);
              confirm();
            }}
          >
            Ok
          </Button>
        </InputGroup>
      </DateFilterContainer>
    ),
    onFilter: (value, record) => {
      return true;
    },
    filterIcon: (filtered) => {
      const Periods = {
        seven: "7",
        fourteen: "14",
        thirty: "30",
        custom: "C",
      };
      const key = Object.keys(Periods).find((key) => attemptedAt.includes(key));
      return (
        <DateFilterIcon>
          <DateFilterValue>
            {filtered ? (key ? Periods[key] : "-") : "-"}
          </DateFilterValue>
        </DateFilterIcon>
      );
    },
  });
  const getDirectionFilter = () => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <DirectionFilterContainer>
        {Directions.map((dir) => (
          <Checkbox
            noLeftMargin
            key={dir.value}
            id={dir.value}
            label={dir.label}
            checked={selectedKeys.includes(dir.value)}
            onChange={(e) =>
              setSelectedKeys(
                e.target.checked
                  ? [...selectedKeys, dir.value]
                  : selectedKeys.filter((item) => item !== dir.value)
              )
            }
          />
        ))}
        <InputGroup flexEnd space>
          <Button text gray onClick={clearFilters}>
            Reset
          </Button>
          <Button
            text
            onClick={() => {
              setDirFilter(selectedKeys);
              confirm();
            }}
          >
            Ok
          </Button>
        </InputGroup>
      </DirectionFilterContainer>
    ),
    onFilter: (value, record) => record.direction === value,
    filterIcon: (filtered) => {
      let iconValue = "-";
      if (filtered) {
        iconValue = dirFilter
          .map((item) => item.slice(0, 1).toUpperCase())
          .join("");
      }
      return (
        <DateFilterIcon>
          <DateFilterValue>{iconValue}</DateFilterValue>
        </DateFilterIcon>
      );
    },
  });
  const Columns = [
    {
      title: "Date",
      dataIndex: "attempted_at",
      key: "attempted_at",
      ...getFilterProps("attempted_at"),
    },
    {
      title: "Direction",
      dataIndex: "direction",
      key: "direction",
      ...getDirectionFilter(),
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
    },
    {
      title: "To",
      dataIndex: "to",
      key: "to",
    },
    {
      title: "Trunk",
      dataIndex: "trunk",
      key: "trunk",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Call-ID",
      dataIndex: "sip_callid",
      key: "sip_callid",
    },
  ];

  //=============================================================================
  // Get recent calls
  //=============================================================================
  const getRecentCalls = async () => {
    try {
      const recentCalls = await axios({
        method: "get",
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Accounts/${account_sid}/CallBillingRecords`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const simplifiedRecentCalls = recentCalls.data.map((call) => {
        return {
          sid: call.call_billing_record_sid,
          date: call.started_at,
          direction: call.direction,
          from: phoneNumberFormat(call.from),
          to: phoneNumberFormat(call.to),
          status: call.status,
          duration: timeFormat(call.duration),
          call_sid: call.call_sid,
        };
      });
      return simplifiedRecentCalls;
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        history.push("/");
        dispatch({
          type: "ADD",
          level: "error",
          message: "Your session has expired. Please log in and try again.",
        });
      } else {
        dispatch({
          type: "ADD",
          level: "error",
          message:
            (err.response && err.response.data && err.response.data.msg) ||
            "Unable to get recent call data",
        });
        console.error(err.response || err);
      }
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    console.log("**** pagination ", pagination);
    console.log("**** filters ", filters);
    console.log("**** sorter ", sorter);
  };

  useEffect(() => {
    let isMounted = true;

    const getRecentCallsData = async () => {
      const data = await getRecentCalls();

      if (isMounted) {
        setRecentCallsData(data);
      }
    };

    getRecentCallsData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //=============================================================================
  // Render
  //=============================================================================
  return (
    <InternalMain type="fullWidthTable" title="Recent Calls">
      <Section fullPage>
        <AntdTable
          dataSource={recentCallsData}
          columns={Columns}
          rowKey="call_sid"
          pagination={{
            showTotal: (total) => `Total: ${total}`,
            current: currentPage,
            total: totalCount,
            pageSize: 25,
            pageSizeOptions: [25, 50, 100],
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
        />
        <TableContent
          fullWidth
          noMenuOnRows
          condensed
          name="recent call"
          getContent={getRecentCalls}
          columns={[
            { header: "Date", key: "date" },
            { header: "Direction", key: "direction" },
            { header: "From", key: "from" },
            { header: "To", key: "to" },
            { header: "Status", key: "status" },
            { header: "Duration", key: "duration", textAlign: "right" },
          ]}
        />
      </Section>
    </InternalMain>
  );
};

export default RecentCallsIndex;
