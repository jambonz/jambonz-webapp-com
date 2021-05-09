import { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import styled from "styled-components/macro";
import { NotificationDispatchContext } from "../../../contexts/NotificationContext";
import InternalMain from "../../../components/wrappers/InternalMain";
import Button from "../../../components/elements/Button";
import InputGroup from "../../../components/elements/InputGroup";
import Label from "../../../components/elements/Label";
import Select from "../../../components/elements/Select";
import Section from "../../../components/blocks/Section";
import AntdTable from "../../../components/blocks/AntdTable";
import handleErrors from "../../../helpers/handleErrors";
import { ResponsiveContext } from "../../../contexts/ResponsiveContext";

const StyledButton = styled(Button)`
  & > span {
    height: 2rem;
  }
`;

const AlertsIndex = () => {
  const { width } = useContext(ResponsiveContext);
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem("jwt");
  const account_sid = localStorage.getItem("account_sid");

  // Table props
  const [alertsData, setAlertsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowCount, setRowCount] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Filter values
  const [attemptedAt, setAttemptedAt] = useState("today");

  //=============================================================================
  // Define Table props
  //=============================================================================
  const Columns = [
    {
      title: "Date",
      dataIndex: "time",
      key: "time",
      width: 250,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      width: width > 600 ? null : 250,
    },
  ];
  const { height } = window.screen;

  const renderPagination = (page, type, originElement) => {
    let node = originElement;

    switch (type) {
      case "page":
        node = <StyledButton gray={currentPage !== page}>{page}</StyledButton>;
        break;
      case "prev":
        node = <StyledButton>{`<`}</StyledButton>;
        break;
      case "next":
        node = <StyledButton>{`>`}</StyledButton>;
        break;
      default:
    }

    return node;
  };
  //=============================================================================
  // Get alerts
  //=============================================================================
  const getAlerts = async () => {
    let isMounted = true;
    try {
      let filter = {
        page: currentPage,
        count: rowCount,
      };

      setLoading(true);

      switch (attemptedAt) {
        case "today":
          filter.start = moment().startOf("date").toISOString();
          break;
        case "7d":
          filter.days = 7;
          break;
        default:
      }

      const alerts = await axios({
        method: "get",
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Accounts/${account_sid}/Alerts`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        params: {
          ...filter,
        },
      });

      if (isMounted) {
        const { total, data } = alerts.data;
        const simplififedAlerts = data.map((alert, index) => ({
          ...alert,
          id: index,
          time: alert.time
            ? moment(alert.time).format("YYYY MM.DD hh:mm a")
            : "",
          message: alert.message,
        }));

        setAlertsData(simplififedAlerts);
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

  useEffect(() => {
    if (currentPage === 1) {
      getAlerts();
    } else {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptedAt]);

  useEffect(() => {
    getAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowCount]);

  return (
    <InternalMain type="fullWidthTable" title="Alerts">
      <Section normalTable>
        <InputGroup flexEnd space>
          <Label indented htmlFor="daterange">
            Date
          </Label>
          <Select
            name="daterange"
            id="daterange"
            value={attemptedAt}
            onChange={(e) => setAttemptedAt(e.target.value)}
          >
            <option value="today">today</option>
            <option value="7d">last 7d</option>
          </Select>
        </InputGroup>
        <AntdTable
          dataSource={alertsData}
          columns={Columns}
          rowKey="id"
          loading={loading}
          pagination={{
            position: ["bottomCenter"],
            onChange: (page, size) => {
              setCurrentPage(page);
              setRowCount(size);
            },
            showTotal: (total) => `Total: ${total} records`,
            current: currentPage,
            total: totalCount,
            pageSize: rowCount,
            pageSizeOptions: [25, 50, 100],
            showSizeChanger: true,
            itemRender: renderPagination,
            showLessItems: true,
            simple: width < 987,
          }}
          scroll={{ y: Math.max(height - 660, 200) }}
        />
      </Section>
    </InternalMain>
  );
};

export default AlertsIndex;
