import { useState, useEffect } from "react";
import styled from "styled-components/macro";
import axios from "axios";
import PropTypes from "prop-types";
import Link from "../../components/elements/Link";
import { ReactComponent as CheckGreen } from "../../images/CheckGreen.svg";
import Loader from "../../components/blocks/Loader";

const Span = styled.span`
  margin-right: 0.75rem;
`;

const List = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 4rem;
`;

const TH = styled.h4`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #707070;
  margin: 0;
`;

const Circle = styled.div`
  width: 4px;
  height: 4px;
  min-width: 4px;
  min-height: 4px;
  border-radius: 50%;
  background: #707070;
  margin-right: 1rem;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;

const AccountSetupList = ({ onComplete }) => {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [carriors, setCarriors] = useState([]);
  const [speeches, setSpeeches] = useState([]);
  const [loading, setLoading] = useState(true);

  const jwt = localStorage.getItem("jwt");
  const account_sid = localStorage.getItem("account_sid");

  const TaskData = [
    {
      node: () => (
        <span>
          Add a <Link to="/account/carriers">carrier</Link> to route calls
        </span>
      ),
      isCompleted: () => carriors && carriors.length > 0,
    },
    {
      node: () => (
        <span>
          Add <Link to="/account/speech-services">speech</Link> credentials for
          text-to-speech and speech-to-text
        </span>
      ),
      isCompleted: () => speeches && speeches.length > 0,
    },
    {
      node: () => (
        <span>
          Create an <Link to="/account/applications">application</Link> to
          handle call routing
        </span>
      ),
      isCompleted: () => applications && applications.length > 0,
    },
    {
      node: () => (
        <span>
          Add a <Link to="/account/phone-numbers">phone number</Link> to receive
          calls
        </span>
      ),
      isCompleted: () => phoneNumbers && phoneNumbers.length > 0,
    },
  ];

  useEffect(() => {
    let isMounted = true;

    const getPhoneNumbers = async () => {
      const phoneNumbersPromise = axios({
        method: "get",
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: "/PhoneNumbers",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const applicationsPromise = axios({
        method: "get",
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: "/Applications",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const carriersPromise = axios({
        method: "get",
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: "/VoipCarriers",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const speechPromise = axios({
        method: "get",
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Accounts/${account_sid}/SpeechCredentials`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const [
        phoneNumbersData,
        applicationsData,
        carriersData,
        speechData,
      ] = await Promise.all([
        phoneNumbersPromise,
        applicationsPromise,
        carriersPromise,
        speechPromise,
      ]);

      if (isMounted) {
        setPhoneNumbers(phoneNumbersData.data);
        setApplications(applicationsData.data);
        setCarriors(carriersData.data);
        setSpeeches(speechData.data);
        setLoading(false);

        if (
          (phoneNumbersData.data || []).length > 0 &&
          (applicationsData.data || []).length > 0 &&
          (carriersData.data || []).length > 0 &&
          (speechData.data || []).length > 0
          ) {
            onComplete(true);
          }
        };
      };

    getPhoneNumbers();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <List>
      <div>
        <TH>To Do</TH>
        {TaskData.filter((task) => !task.isCompleted()).map((task, index) => (
          <TaskItem key={index}>
            <Circle />
            {task.node()}
          </TaskItem>
        ))}
      </div>
      <div>
        <TH>Complete</TH>
        {TaskData.filter((task) => task.isCompleted()).map((task, index) => (
          <TaskItem key={index}>
            <Span>
              <CheckGreen style={{ display: "block" }} aria-label="complete" />
            </Span>
            {task.node()}
          </TaskItem>
        ))}
      </div>
    </List>
  );
};

AccountSetupList.propTypes = {
  onComplete: PropTypes.func,
};

AccountSetupList.defaultProps = {
  onComplete: () => {},
};

export default AccountSetupList;
