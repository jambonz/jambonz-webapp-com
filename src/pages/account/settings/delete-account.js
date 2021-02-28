import { useState, useEffect, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { NotificationDispatchContext } from '../../../contexts/NotificationContext';
import InternalMain from '../../../components/wrappers/InternalMain';
import FormError from '../../../components/blocks/FormError';
import Loader from '../../../components/blocks/Loader';
import Section from '../../../components/blocks/Section';
import Form from '../../../components/elements/Form';
import Input from '../../../components/elements/Input';
import InputGroup from '../../../components/elements/InputGroup';
import Label from '../../../components/elements/Label';
import Strong from '../../../components/elements/Strong';
import Button from '../../../components/elements/Button';
import PasswordInput from '../../../components/elements/PasswordInput';

const SettingsDeleteAccount = () => {

  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');
  const account_sid = localStorage.getItem('account_sid');

  // Refs
  const refPassword = useRef(null);
  const refDeleteMessage = useRef(null);

  // Form inputs
  const [ password,      setPassword      ] = useState('');
  const [ deleteMessage, setDeleteMessage ] = useState('');

  // Invalid form inputs
  const [ invalidPassword,      setInvalidPassword      ] = useState(false);
  const [ invalidDeleteMessage, setInvalidDeleteMessage ] = useState(false);

  const [ showLoader, setShowLoader ] = useState(true);
  const [ errorMessage, setErrorMessage ] = useState('');
  const [ requiresPassword, setRequiresPassword ] = useState(true);

  useEffect(() => {
    const getAPIData = async () => {
      let isMounted = true;
      try {
        const userResponse = await axios({
          method: 'get',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: `/Users/me`,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!userResponse.data || !userResponse.data.user || !userResponse.data.user.provider) {
          throw new Error('Unable to get user data');
        }

        if (userResponse.data.user.provider !== 'local') {
          setRequiresPassword(false);
        }

        setShowLoader(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('jwt');
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
          history.push('/account/settings');
          dispatch({
            type: 'ADD',
            level: 'error',
            message: (
              (err.response && err.response.data && err.response.data.msg) ||
              err.message || 'Unable to get account data'
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
      setInvalidPassword(false);
      setInvalidDeleteMessage(false);
      let errorMessages = [];
      let focusHasBeenSet = false;

      if (requiresPassword && !password) {
        errorMessages.push('You must provide your password in order to delete your account.');
        setInvalidPassword(true);
        if (!focusHasBeenSet) {
          refPassword.current.focus();
          focusHasBeenSet = true;
        }
      }

      if (!deleteMessage) {
        errorMessages.push('You must type the delete message in order to delete your account.');
        setInvalidDeleteMessage(true);
        if (!focusHasBeenSet) {
          refDeleteMessage.current.focus();
          focusHasBeenSet = true;
        }
      } else if (deleteMessage !== 'delete my account') {
        errorMessages.push('You must type the delete message correctly in order to delete your account.');
        setInvalidDeleteMessage(true);
        if (!focusHasBeenSet) {
          refDeleteMessage.current.focus();
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
      await axios({
        method: 'delete',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Accounts/${account_sid}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data: {
          password,
        }
      });

      isMounted = false;
      history.push('/');
      dispatch({
        type: 'ADD',
        level: 'success',
        message: `Thanks for trying out jambonz!`,
      });

    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('jwt');
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
      title="Delete Account"
      breadcrumbs={[
        { name: 'Back to Settings', url: '/account/settings' },
      ]}
    >
      <Section>
        {showLoader ? (
          <Loader height="224px" />
        ) : (
          <Form large onSubmit={handleSubmit}>
            <p style={{ gridColumn: '1/3', textAlign: 'left' }}>
              <Strong>Warning!</Strong> This will permantly delete all of your
              data from our database. You will not be able to restore your account. You
              must {requiresPassword && 'provide your password and'} type “delete my
              account” into the Delete Message field.
            </p>

            {requiresPassword && (
              <>
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  allowShowPassword
                  name="password"
                  id="password"
                  password={password}
                  setPassword={setPassword}
                  setErrorMessage={setErrorMessage}
                  invalid={invalidPassword}
                  ref={refPassword}
                />
              </>
            )}

            <Label style={{ width: '8rem' }} htmlFor="deleteMessage">Delete Message</Label>
            <Input
              name="deleteMessage"
              id="deleteMessage"
              value={deleteMessage}
              onChange={e => setDeleteMessage(e.target.value)}
              invalid={invalidDeleteMessage}
              ref={refDeleteMessage}
            />

            {errorMessage && (
              <FormError grid message={errorMessage} />
            )}

            <InputGroup flexEnd spaced>
              <Button
                gray
                type="button"
                onClick={() => {
                  history.push('/account/settings');
                  dispatch({
                    type: 'ADD',
                    level: 'info',
                    message: 'Canceled',
                  });
                }}
              >
                Cancel
              </Button>

              <Button>PERMANENTLY DELETE MY ACCOUNT</Button>
            </InputGroup>
          </Form>
        )}
      </Section>
    </InternalMain>
  );
};

export default SettingsDeleteAccount;
