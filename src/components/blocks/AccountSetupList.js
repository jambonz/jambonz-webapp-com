import { useState, useEffect } from "react";
import styled from "styled-components/macro";
import axios from "axios";
import { Edit, CheckSquare } from "react-feather";
import PropTypes from "prop-types";
import Link from "../../components/elements/Link";
import Loader from "../../components/blocks/Loader";


const List = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 4rem;

  ${props => props.theme.mobileOnly} {
    display: block;
  }
`;

const TH = styled.h4`
  font-weight: bold;
  font-size: 16px;
  line-height: 1.88;
  color: #231f20;
  margin: 0;

  ${props => props.theme.mobileOnly} {
    margin-top: 1.5rem;
  }
`;

const TaskItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  margin-top: 1rem;
  font-size: 14px;
  font-weight: 500;
  line-height: 2;
  color: #231f20;

  & > span {
    margin-left: 0.5rem;
  }

  ${props => props.theme.mobileOnly} {
    margin-left: 10px;
  }
`;

const AccountSetupList = ({ onComplete }) => {
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
            <Edit size={14} color="#231f20" />
            {task.node()}
          </TaskItem>
        ))}
      </div>
      <div>
        <TH>Complete</TH>
        {TaskData.filter((task) => task.isCompleted()).map((task, index) => (
          <TaskItem key={index}>
            <CheckSquare size={14} color="#008a1a" />
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
