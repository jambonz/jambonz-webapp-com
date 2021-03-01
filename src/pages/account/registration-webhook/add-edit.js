import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { NotificationDispatchContext } from '../../../contexts/NotificationContext';
import InternalMain from '../../../components/wrappers/InternalMain';
import Section from '../../../components/blocks/Section';
import Form from '../../../components/elements/Form';
import Input from '../../../components/elements/Input';
import Label from '../../../components/elements/Label';
import InputGroup from '../../../components/elements/InputGroup';
import PasswordInput from '../../../components/elements/PasswordInput';
import FormError from '../../../components/blocks/FormError';
import Button from '../../../components/elements/Button';
import Loader from '../../../components/blocks/Loader';

const RegistrationWebhookAddEdit = () => {
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
            message: (err.response && err.response.data && err.response.data.msg) || 'That registration webhook does not exist',
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
        errorMessages.push('Please provide a registration webhook.');
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
        registration_hook: {
          url: webhook.trim(),
          method: webhookMethod,
          username: webhookUser.trim() || null,
          password: webhookPass || null,
        },
      };

      if (type === 'edit') {
        data.registration_hook.webhook_sid = webhook_sid;
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
        message: `Registration webhook ${type === 'add' ? 'created' : 'updated'} successfully`,
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
      title={`${type === 'edit' ? 'Edit' : 'Add'} Registration Webhook`}
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
          <Form
            large
            onSubmit={handleSubmit}
          >
            <Label htmlFor="name">Registration Webhook</Label>
            <Input
              name="webhook"
              id="webhook"
              value={webhook}
              onChange={e => setWebhook(e.target.value)}
              placeholder="URL that handles registrations"
              invalid={invalidWebhook}
              autoFocus
              ref={refWebhook}
            />

            {showAuth ? (
              <InputGroup>
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
              </InputGroup>
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

            <InputGroup flexEnd spaced>
              <Button
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

              <Button>
                {type === 'add'
                  ? 'Add Registration Webhook'
                  : 'Save'
                }
              </Button>
            </InputGroup>
          </Form>
        )}
      </Section>
    </InternalMain>
  );
};

export default RegistrationWebhookAddEdit;
