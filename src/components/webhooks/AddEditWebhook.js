import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components/macro';
import { NotificationDispatchContext } from '../../contexts/NotificationContext';
import InternalMain from '../wrappers/InternalMain';
import Section from '../blocks/Section';
import Form from '../elements/Form';
import Input from '../elements/Input';
import Label from '../elements/Label';
import InputGroup from '../elements/InputGroup';
import PasswordInput from '../elements/PasswordInput';
import FormError from '../blocks/FormError';
import Button from '../elements/Button';
import Loader from '../blocks/Loader';

const StyledInputGroup = styled(InputGroup)`
  @media (max-width: 575.98px) {
    grid-column: 1 / 3;
  }

  @media (max-width: 459.98px) {
    display: flex;
    flex-direction: column;

    & > button {
      width: 100%;
      margin-right: 0;

      &:first-child {
        margin-bottom: 1rem;
      }

      & > span {
        width: 100%;
      }
    }
  }
`;

const HTTPGroup = styled(InputGroup)`
  @media (max-width: 767.98px) {
    display: grid;
    grid-template-columns: 1.3fr 10fr;
    grid-row-gap: 1rem;
    grid-column: 1 / 3;

    & > label {
      margin: 0;
      margin-right: 1.75rem;
    }
  }

  @media (max-width: 575.98px) {
    display: flex;
    flex-direction: column;

    & > * {
      width: 100%;
      margin: 0 0 1rem;
    }

    & > label {
      margin-right: 0;
    }
  }
`;

const StyledForm = styled(Form)`
  @media (max-width: 575px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    grid-row-gap: 1rem;

    & > * {
      width: 100%;
    }
  }
`;

const AddEditWebhook = (props) => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');
  const account_sid = localStorage.getItem('account_sid');

  const { webhook_sid } = useParams();
  const type = webhook_sid ? 'edit' : 'add';

  // Refs
  const refWebhook = useRef(null);
  const refWebhookUser = useRef(null);
  const refWebhookPass = useRef(null);

  // Form inputs
  const [ webhook,       setWebhook       ] = useState('');
  const [ webhookMethod, setWebhookMethod ] = useState('POST');
  const [ webhookUser,   setWebhookUser   ] = useState('');
  const [ webhookPass,   setWebhookPass   ] = useState('');

  // Invalid form inputs
  const [ invalidWebhook,     setInvalidWebhook     ] = useState(false);
  const [ invalidWebhookUser, setInvalidWebhookUser ] = useState(false);
  const [ invalidWebhookPass, setInvalidWebhookPass ] = useState(false);

  const [ showLoader, setShowLoader ] = useState(true);
  const [ errorMessage, setErrorMessage ] = useState('');

  const [ showAuth, setShowAuth ] = useState(false);
  const toggleAuth = () => setShowAuth(!showAuth);

  useEffect(() => {
    const getAPIData = async () => {
      let isMounted = true;
      try {
        if (type === 'edit') {
          const webhookResponse = await axios({
            method: 'get',
            baseURL: process.env.REACT_APP_API_BASE_URL,
            url: `/Webhooks/${webhook_sid}`,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });

          const hook = webhookResponse.data;

          setWebhook(hook.url || '');
          setWebhookMethod(hook.method || 'post');
          setWebhookUser(hook.username || '');
          setWebhookPass(hook.password || '');

          if (hook.username || hook.username) {
            setShowAuth(true);
          }
        }
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
            message: (err.response && err.response.data && err.response.data.msg) || `That ${props.hookName} webhook does not exist`,
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
      setInvalidWebhook(false);
      setInvalidWebhookUser(false);
      setInvalidWebhookPass(false);
      let errorMessages = [];
      let focusHasBeenSet = false;

      if (!webhook) {
        errorMessages.push(`Please provide a ${props.hookName} webhook.`);
        setInvalidWebhook(true);
        if (!focusHasBeenSet) {
          refWebhook.current.focus();
          focusHasBeenSet = true;
        }
      }

      if ((webhookUser && !webhookPass) || (!webhookUser && webhookPass)) {
        errorMessages.push('Username and password must be either both filled out or both empty.');
        setInvalidWebhookUser(true);
        setInvalidWebhookPass(true);
        if (!focusHasBeenSet) {
          if (!webhookUser) {
            refWebhookUser.current.focus();
          } else {
            refWebhookPass.current.focus();
          }
          focusHasBeenSet = true;
        }
      }

      if (errorMessages.length > 1) {
        setErrorMessage(errorMessages);
        return;
      } else if (errorMessages.length === 1) {
        setErrorMessage(errorMessages[0]);
        return;
      }

      //=============================================================================
      // Submit
      //=============================================================================
      const data = {
        [props.hookProp]: {
          url: webhook.trim(),
          method: webhookMethod,
          username: webhookUser.trim() || null,
          password: webhookPass || null,
        },
      };

      if (type === 'edit') {
        data[props.hookProp].webhook_sid = webhook_sid;
      }

      await axios({
        method: 'put',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Accounts/${account_sid}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data,
      });

      isMounted = false;
      history.push('/account');
      dispatch({
        type: 'ADD',
        level: 'success',
        message: `${props.hookName} webhook ${type === 'add' ? 'created' : 'updated'} successfully`,
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
      title={`${type === 'edit' ? 'Edit' : 'Add'} ${props.hookName} Webhook`}
      breadcrumbs={[
        { name: 'Back to Account Home', url: '/account' },
      ]}
    >
      <Section>
        {showLoader ? (
          <Loader
            height={
              type === 'edit'
                ? '646px'
                : '611px'
            }
          />
        ) : (
          <StyledForm
            large
            onSubmit={handleSubmit}
          >
            <Label htmlFor="name">{props.hookName} Webhook</Label>
            <Input
              name="webhook"
              id="webhook"
              value={webhook}
              onChange={e => setWebhook(e.target.value)}
              placeholder={props.hookPlaceholder}
              invalid={invalidWebhook}
              autoFocus
              ref={refWebhook}
            />

            {showAuth ? (
              <HTTPGroup>
                <Label indented htmlFor="webhookUser">User</Label>
                <Input
                  name="webhookUser"
                  id="webhookUser"
                  value={webhookUser}
                  onChange={e => setWebhookUser(e.target.value)}
                  placeholder="Optional"
                  invalid={invalidWebhookUser}
                  ref={refWebhookUser}
                />
                <Label htmlFor="webhookPass" middle>Password</Label>
                <PasswordInput
                  allowShowPassword
                  name="webhookPass"
                  id="webhookPass"
                  password={webhookPass}
                  setPassword={setWebhookPass}
                  setErrorMessage={setErrorMessage}
                  placeholder="Optional"
                  invalid={invalidWebhookPass}
                  ref={refWebhookPass}
                />
              </HTTPGroup>
            ) : (
              <Button
                text
                formLink
                type="button"
                onClick={toggleAuth}
              >
                Use HTTP Basic Authentication
              </Button>
            )}

            {errorMessage && (
              <FormError grid message={errorMessage} />
            )}

            <StyledInputGroup flexEnd spaced>
              <Button
                rounded="true"
                gray
                type="button"
                onClick={() => {
                  history.push('/account');
                  dispatch({
                    type: 'ADD',
                    level: 'info',
                    message: 'Changes canceled',
                  });
                }}
              >
                Cancel
              </Button>

              <Button rounded="true">
                {type === 'add'
                  ? `Add ${props.hookName} Webhook`
                  : 'Save'
                }
              </Button>
            </StyledInputGroup>
          </StyledForm>
        )}
      </Section>
    </InternalMain>
  );
};

export default AddEditWebhook;
