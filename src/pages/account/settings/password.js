import { useState, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { NotificationDispatchContext } from '../../../contexts/NotificationContext';
import InternalMain from '../../../components/wrappers/InternalMain';
import FormError from '../../../components/blocks/FormError';
import Loader from '../../../components/blocks/Loader';
import Section from '../../../components/blocks/Section';
import Button from '../../../components/elements/Button';
import Form from '../../../components/elements/Form';
import InputGroup from '../../../components/elements/InputGroup';
import Label from '../../../components/elements/Label';
import PasswordInput from '../../../components/elements/PasswordInput';

const SettingsChangePassword = () => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');
  const user_sid = localStorage.getItem('user_sid');

  const refOldPassword = useRef(null);
  const refNewPassword = useRef(null);
  const [ oldPassword, setOldPassword ] = useState('');
  const [ newPassword, setNewPassword ] = useState('');
  const [ invalidOldPassword, setInvalidOldPassword ] = useState(false);
  const [ invalidNewPassword, setInvalidNewPassword ] = useState(false);
  const [ showLoader, setShowLoader ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState('');

  const handleSubmit = async (e) => {
    let isMounted = true;
    try {
      setShowLoader(true);
      e.preventDefault();
      setErrorMessage('');
      setInvalidOldPassword(false);
      setInvalidNewPassword(false);
      let errorMessages = [];
      let focusHasBeenSet = false;

      if (!oldPassword) {
        errorMessages.push('Please provide your old password.');
        setInvalidOldPassword(true);
        if (!focusHasBeenSet) {
          refOldPassword.current.focus();
          focusHasBeenSet = true;
        }
      }

      if (!newPassword) {
        errorMessages.push('Please provide your new password.');
        setInvalidNewPassword(true);
        if (!focusHasBeenSet) {
          refNewPassword.current.focus();
          focusHasBeenSet = true;
        }
      }

      if (!newPassword) {
        errorMessages.push('Password is required.');
        setInvalidNewPassword(true);
        if (!focusHasBeenSet) {
          refNewPassword.current.focus();
          focusHasBeenSet = true;
        }

      } else {

        if (newPassword.length < 6) {
          errorMessages.push('Password must be at least 6 characters long.');
          setInvalidNewPassword(true);
          if (!focusHasBeenSet) {
            refNewPassword.current.focus();
            focusHasBeenSet = true;
          }
        }

        if (!/[a-zA-Z]/.test(newPassword)) {
          errorMessages.push('Password must contain a letter.');
          setInvalidNewPassword(true);
          if (!focusHasBeenSet) {
            refNewPassword.current.focus();
            focusHasBeenSet = true;
          }
        }

        if (!/[0-9]/.test(newPassword)) {
          errorMessages.push('Password must contain a number.');
          setInvalidNewPassword(true);
          if (!focusHasBeenSet) {
            refNewPassword.current.focus();
            focusHasBeenSet = true;
          }
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
        method: 'post',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/change-password`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data: {
          old_password: oldPassword,
          new_password: newPassword,
        },
      });

      isMounted = false;
      history.push('/account/settings');
      dispatch({
        type: 'ADD',
        level: 'success',
        message: `Password updated successfully`,
      });
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const { msg } = err.response.data;
        if (msg === "old_password is incorrect") {
          setErrorMessage("You entered an invalid password for your current password.  Please try again.");
        } else {
          setErrorMessage(msg);
        }
      } else if (err.response && err.response.status === 401) {
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
      title="Change Password"
      breadcrumbs={[
        { name: 'Back to Settings', url: '/account/settings' },
      ]}
    >
      <Section>
        {showLoader ? (
          <Loader height="611px" />
        ) : (
          <Form
            large
            onSubmit={handleSubmit}
          >
            <Label style={{ width: '7.5rem' }} htmlFor="oldPassword">Old Password</Label>
            <PasswordInput
              allowShowPassword
              name="oldPassword"
              id="oldPassword"
              password={oldPassword}
              setPassword={setOldPassword}
              setErrorMessage={setErrorMessage}
              invalid={invalidOldPassword}
              autoFocus
              ref={refOldPassword}
            />

            <Label htmlFor="newPassword">New Password</Label>
            <PasswordInput
              allowShowPassword
              name="newPassword"
              id="newPassword"
              password={newPassword}
              setPassword={setNewPassword}
              setErrorMessage={setErrorMessage}
              invalid={invalidNewPassword}
              ref={refNewPassword}
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
                    message: 'Changes canceled',
                  });
                }}
              >
                Cancel
              </Button>

              <Button>Save</Button>
            </InputGroup>
          </Form>
        )}
      </Section>
    </InternalMain>
  );
};

export default SettingsChangePassword;
