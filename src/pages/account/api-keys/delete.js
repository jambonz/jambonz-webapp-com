import { useContext } from 'react';
import { Link as ReactRouterLink, useHistory } from "react-router-dom";
import axios from 'axios';
import { NotificationDispatchContext } from '../../../contexts/NotificationContext';
import InternalMain from '../../../components/wrappers/InternalMain';
import Section from '../../../components/blocks/Section';
import P from '../../../components/elements/P';
import Button from '../../../components/elements/Button';
import InputGroup from '../../../components/elements/InputGroup';

const ApiKeyDelete = (props) => {
  const { id } = props.match.params || {};
  const dispatch = useContext(NotificationDispatchContext);
  let history = useHistory();

  const jwt = localStorage.getItem('jwt');

  const apiKeyDelete = async () => {
    try {
      await axios({
        method: 'delete',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/ApiKeys/${id}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      dispatch({
        type: 'ADD',
        level: 'success',
        message: `API Key was deleted successfully.`,
      });

      history.push("/account");
    } catch (error) {
      dispatch({
        type: 'ADD',
        level: 'error',
        message: `Error deleting API key: ${error.message}`
      });
    }
  };

  return (
    <InternalMain
      title="Delete API Key"
      breadcrumbs={[{ name: "Back to Account Home", url: "/account" }]}
    >
      <Section>
        <P>Are you sure you want to delete this API key? This cannot be undone, but you can always create new API keys.</P>
        <InputGroup flexEnd spaced>
          <Button
            rounded="true"
            font="12px"
            gray="true"
            as={ReactRouterLink}
            to="/account"
          >
            Cancel
          </Button>
          <Button
            rounded="true"
            font="12px"
            onClick={apiKeyDelete}
          >
            Delete
          </Button>
        </InputGroup>
      </Section>
    </InternalMain>
  );
};

export default ApiKeyDelete;
