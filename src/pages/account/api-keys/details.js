import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import styled from 'styled-components/macro';
import { Link as ReactRouterLink } from "react-router-dom";
import InternalMain from "../../../components/wrappers/InternalMain";
import P from "../../../components/elements/P";
import Section from "../../../components/blocks/Section";
import Copy from "../../../components/elements/Copy";
import Button from "../../../components/elements/Button";
import InputGroup from "../../../components/elements/InputGroup";
import Loader from "../../../components/blocks/Loader";

const APIKeyInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: fit-content;
  grid-gap: 16px 30px;
  margin-bottom: 1.5rem;
`;

const Cell = styled.span`
  font-family: 'WorkSans';
  font-size: 16px;
  line-height: 19px;
`;

const ApiKeyDetails = (props) => {
  const [data, setData] = useState({});
  const [showLoader, setShowLoader] = useState(true);

  const { id } = props.match.params || {};
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    let isMounted = true;
    const getData = async () => {
      try {
        const userResponse = await axios({
          method: "get",
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: "/Users/me",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        const apiKey = userResponse.data.api_keys.find(
          (item) => item.api_key_sid === id
        );
        setData(apiKey || {});
      } catch (error) {
        isMounted = false;
      } finally {
        if (isMounted) {
          setShowLoader(false);
        }
      }
    };

    getData();
  }, []);
  return (
    <InternalMain
      title="API Key Details"
      topMenu={{ label: "← Back to Account Home", link: "/account" }}
    >
      {showLoader ? (
        <Loader height="calc(100vh - 24rem)" />
      ) : (
        <Section>
          <P>
            {data.token} <Copy title="API Key" value={data.token} />
          </P>
          <APIKeyInfo>
            <Cell>Last Used</Cell>
            <Cell>{data.last_used ? moment(data.last_used).format('YYYY-MM-DD') : ""}</Cell>
            <Cell>Created</Cell>
            <Cell>{moment(data.created_at).format('YYYY-MM-DD')}</Cell>
          </APIKeyInfo>
          <InputGroup flexEnd spaced>
            <Button as={ReactRouterLink} to="/account" gray="true" disabled={true}>
              Back to Account Home
            </Button>
          </InputGroup>
        </Section>
      )}
    </InternalMain>
  );
};

export default ApiKeyDetails;
