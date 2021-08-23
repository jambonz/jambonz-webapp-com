import { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { NotificationDispatchContext } from '../../contexts/NotificationContext';
import InternalMain from '../wrappers/InternalMain';
import Section from '../blocks/Section';
import InputGroup from '../elements/InputGroup';
import P from '../elements/P';
import FormError from '../blocks/FormError';
import Button from '../elements/Button';
import Loader from '../blocks/Loader';

const DeleteWebhook = (props) => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');
  const account_sid = localStorage.getItem('account_sid');

  const { webhook_sid } = useParams();

  const [ url, setUrl] = useState('');
  const [ showLoader, setShowLoader ] = useState(true);
  const [ errorMessage, setErrorMessage ] = useState('');

  useEffect(() => {
    const getAPIData = async () => {
      let isMounted = true;
      try {
        const webhookResponse = await axios({
          method: 'get',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: `/Webhooks/${webhook_sid}`,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!webhookResponse.data || !webhookResponse.data.url) {
          throw new Error(`No ${props.hookName} webhook to delete`);
        }

        setUrl(webhookResponse.data.url || '');
        setShowLoader(false);

      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          sessionStorage.clear();
          isMounted = false;
          history.push('/');
          dispatch({
            type: 'ADD',
            level: 'error',
            message: 'Your session has expired. Please log in and try again.',
          });
        } else {
          isMounted = false;
          history.push('/account');
          dispatch({
            type: 'ADD',
            level: 'error',
            message: (
              (err.response && err.response.data && err.response.data.msg) ||
              err.message || `That ${props.hookName} webhook does not exist`
            ),
          });
          console.error(err.response || err);
        }
      } finally {
        if (isMounted) {
          setShowLoader(false);
        }
      }
    };
    getAPIData();
    // eslint-disable-next-line
  }, []);


  const handleSubmit = async (e) => {
    let isMounted = true;
    try {
      setShowLoader(true);
      e.preventDefault();
      setErrorMessage('');

      await axios({
        method: 'put',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Accounts/${account_sid}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data: {
          [props.hookProp]: null,
        },
      });

      isMounted = false;
      history.push('/account');
      dispatch({
        type: 'ADD',
        level: 'success',
        message: `${props.hookName} webhook deleted successfully`,
      });

    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        isMounted = false;
        history.push('/');
        dispatch({
          type: 'ADD',
          level: 'error',
          message: 'Your session has expired. Please log in and try again.',
        });
      } else {
        setErrorMessage((err.response && err.response.data && err.response.data.msg) || 'Something went wrong, please try again.');
        console.error(err.response || err);
      }
    } finally {
      if (isMounted) {
        setShowLoader(false);
      }
    }
  };

  return (
    <InternalMain
      type="form"
      title={`Delete ${props.hookName} Webhook`}
      breadcrumbs={[
        { name: 'Back to Account Home', url: '/account' },
      ]}
    >
      <Section>
        {showLoader ? (
          <Loader height="611px" />
        ) : (
          <>
            <P>
              Are you sure you want to delete the {props.hookName}
              webhook <strong>{url}</strong>? You can always create another one.
            </P>
            {errorMessage && (
              <FormError message={errorMessage} />
            )}

            <InputGroup flexEnd spaced>
              <Button
                rounded="true"
                gray
                type="button"
                onClick={() => {
                  history.push('/account');
                  dispatch({
                    type: 'ADD',
                    level: 'info',
                    message: 'Canceled',
                  });
                }}
              >
                Cancel
              </Button>

              <Button rounded="true" onClick={handleSubmit}>
                Delete {props.hookName} Webhook
              </Button>
            </InputGroup>
          </>
        )}
      </Section>
    </InternalMain>
  );
};

export default DeleteWebhook;
