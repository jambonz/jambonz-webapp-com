import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import styled from "styled-components/macro";
import DatePicker from "antd/lib/date-picker";
import { NotificationDispatchContext } from "../../../contexts/NotificationContext";
import InternalMain from "../../../components/wrappers/InternalMain";
import Section from "../../../components/blocks/Section";
import AntdTable from "../../../components/blocks/AntdTable";
import phoneNumberFormat from "../../../helpers/phoneNumberFormat";
import timeFormat from "../../../helpers/timeFormat";
import Radio from "../../../components/elements/Radio";
import Label from "../../../components/elements/Label";
import InputGroup from "../../../components/elements/InputGroup";
import Button from "../../../components/elements/Button";
import Checkbox from "../../../components/elements/Checkbox";
import Loader from "../../../components/blocks/Loader";
import handleErrors from "../../../helpers/handleErrors";

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
    days: 7,
  },
  {
    label: "Last 14 days",
    value: "fourteen",
    days: 14,
  },
  {
    label: "Last 30 days",
    value: "thirty",
    days: 30,
  },
  {
    label: "Custom",
    value: "custom",
    days: null,
  },
];

const DateFilterContainer = styled.div`
  padding: 1rem;
  width: 200px;
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

const DateContainer = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr;
  grid-gap: 0.5rem;
  margin: 0.5rem 0;
`;

const DateLabel = styled.span`
  color: #767676;
  text-align: right;
  font-size: 14px;
`;

const StyledLoader = styled.div`
  height: 100%;
  width: 100%;
  position: relative !important;
  top: 0 !important;
  left: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ExpandedSection = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 0.5rem;
  width: 100%;
  padding: 1rem;
`;

const RecentCallsIndex = () => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem("jwt");
  const account_sid = localStorage.getItem("account_sid");

  // Table props
  const [recentCallsData, setRecentCallsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowCount, setRowCount] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Filter values
  const [attemptedAt, setAttemptedAt] = useState("-");
  const [dirFilter, setDirFilter] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // width
  const { height } = window.screen;

  //=============================================================================
  // Define Table props
  //=============================================================================
  const getDateFilter = () => ({
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
        {selectedKeys.includes("custom") && (
          <DateContainer>
            <DateLabel>Start:</DateLabel>
            <DatePicker size="small" onChange={setStartDate} />
            <DateLabel>End:</DateLabel>
            <DatePicker size="small" onChange={setEndDate} />
          </DateContainer>
        )}
        <InputGroup flexEnd space>
          <Button text gray onClick={clearFilters}>
            Reset
          </Button>
          <Button
            text
            onClick={() => {
              setAttemptedAt(selectedKeys);
              confirm();
              // handleFilterChange();
            }}
            disabled={selectedKeys.includes("custom") && !startDate && !endDate}
          >
            Ok
          </Button>
        </InputGroup>
      </DateFilterContainer>
    ),
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
              // handleFilterChange();
            }}
          >
            Ok
          </Button>
        </InputGroup>
      </DirectionFilterContainer>
    ),
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
  const getStatusFilter = () => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <DirectionFilterContainer>
        <Radio
          noLeftMargin
          id="answered"
          label="answered"
          checked={selectedKeys.includes("answered")}
          onChange={(e) =>
            setSelectedKeys(e.target.checked ? ["answered"] : [])
          }
        />
        <Radio
          noLeftMargin
          id="no-answered"
          label="no answered"
          checked={selectedKeys.includes("no-answered")}
          onChange={(e) =>
            setSelectedKeys(e.target.checked ? ["no-answered"] : [])
          }
        />
        <InputGroup flexEnd space>
          <Button
            text
            gray
            onClick={() => {
              setAnswered(null);
              clearFilters();
            }}
          >
            Reset
          </Button>
          <Button
            text
            onClick={() => {
              setAnswered(selectedKeys.join(""));
              confirm();
              // handleFilterChange();
            }}
          >
            Ok
          </Button>
        </InputGroup>
      </DirectionFilterContainer>
    ),
    filterIcon: (filtered) => {
      let iconValue = "-";
      if (filtered) {
        iconValue = answered === "answered" ? "A" : "N";
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
      ...getDateFilter(),
      width: 160,
    },
    {
      title: "Direction",
      dataIndex: "direction",
      key: "direction",
      ...getDirectionFilter(),
      width: 150,
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
      width: 200,
    },
    {
      title: "To",
      dataIndex: "to",
      key: "to",
      width: 200,
    },
    {
      title: "Trunk",
      dataIndex: "trunk",
      key: "trunk",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ...getStatusFilter(),
      width: 200,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: 150,
    },
  ];

  //=============================================================================
  // Get recent calls
  //=============================================================================
  const handleFilterChange = () => {
    let filter = {};
    if (attemptedAt && attemptedAt.length > 0) {
      const days = DateFilters.find((item) => item.value === attemptedAt[0]);

      if (days) {
        filter.days = days.days;
      }
    }

    if (dirFilter && dirFilter.length === 1) {
      filter.direction = dirFilter[0];
    }

    if (answered) {
      filter.answered =
        answered.length && answered[0] === "answered" ? "true" : "false";
    }

    if (startDate) {
      filter.start = startDate.toISOString();
    }

    if (endDate) {
      filter.end = endDate.toISOString();
    }

    console.log("***** filter ", filter);
    getRecentCallsData(filter);
  };
  // const handleTableChange = (pagination, filters, sorter) => {
  //   console.log("****** handleTableChange ", pagination, filters);
  //   setCurrentPage(pagination.current);
  //   setRowCount(pagination.pageSize);

  //   const { attempted_at, direction, status } = filters || {};
  //   let filter = {};

  //   if (attempted_at && attempted_at.length > 0) {
  //     const days = DateFilters.find((item) => item.value === attempted_at[0]);

  //     if (days) {
  //       filter.days = days.days;
  //     }
  //   }

  //   if (direction && direction.length === 1) {
  //     filter.direction = direction[0];
  //   }

  //   if (status) {
  //     filter.answered =
  //       status.length && status[0] === "answered" ? "true" : "false";
  //   }

  //   if (startDate) {
  //     filter.start = startDate.toISOString();
  //   }

  //   if (endDate) {
  //     filter.end = endDate.toISOString();
  //   }

  //   console.log("***** filter ", filter);
  //   getRecentCallsData(filter);
  // };

  const getRecentCallsData = async (filter = {}) => {
    let isMounted = true;

    try {
      setLoading(true);
      const result = await axios({
        method: "get",
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Accounts/${account_sid}/RecentCalls`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        params: {
          page: currentPage,
          count: rowCount,
          ...filter,
        },
      });

      if (isMounted) {
        const { total, data } = result.data;

        const recentCalls = data.map((item, index) => ({
          key: index,
          ...item,
          attempted_at: item.attempted_at
            ? moment(item.attempted_at).format("YYYY MM.DD")
            : "",
          from: phoneNumberFormat(item.from),
          to: phoneNumberFormat(item.to),
          status: item.answered ? "answered" : item.termination_reason,
          duration: timeFormat(item.duration),
        }));

        setRecentCallsData(recentCalls);
        setTotalCount(total);
      }
    } catch (err) {
      handleErrors({ err, history, dispatch });
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const renderExpandedRow = (data) => (
    <ExpandedSection>
      {Object.keys(data).map((field, index) => (
        <React.Fragment key={index}>
          <Label textAlign="right">{`${field}:`}</Label>
          <Label>{data[field]}</Label>
        </React.Fragment>
      ))}
    </ExpandedSection>
  );

  useEffect(() => {
    handleFilterChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowCount]);

  useEffect(() => {
    getRecentCallsData();
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
          rowKey="key"
          loading={{
            spinning: loading,
            indicator: (
              <StyledLoader>
                <Loader />
              </StyledLoader>
            ),
          }}
          pagination={{
            onChange: (page, size) => {
              setRowCount(size);
              setCurrentPage(page);
            },
            showTotal: (total) => `Total: ${total}`,
            current: currentPage,
            total: totalCount,
            pageSize: rowCount,
            pageSizeOptions: [25, 50, 100],
            showSizeChanger: true,
          }}
          scroll={{ y: Math.max(height - 490, 200) }}
          expandable={{
            expandedRowRender: renderExpandedRow,
          }}
        />
      </Section>
    </InternalMain>
  );
};

export default RecentCallsIndex;
