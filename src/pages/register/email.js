import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import SetupTemplate from '../../components/templates/SetupTemplate';
import Form from '../../components/elements/Form';
import Button from '../../components/elements/Button';
import Link from '../../components/elements/Link';
import Input from '../../components/elements/Input';
import PasswordInput from '../../components/elements/PasswordInput';
import FormError from '../../components/blocks/FormError';
import Loader from '../../components/blocks/Loader';
import generateActivationCode from '../../helpers/generateActivationCode';

const RegisterWithEmail = props => {
  let history = useHistory();
  useEffect(() => {
    document.title = `Register With Email | Jambonz`;
  });

  // Refs
  const refName = useRef(null);
  const refEmail = useRef(null);
  const refPassword = useRef(null);

  // Form inputs
  const [ name,         setName         ] = useState('');
  const [ email,        setEmail        ] = useState('');
  const [ password,     setPassword     ] = useState('');

  const [ showLoader, setShowLoader ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState('');

  // Invalid form inputs
  const [ invalidName,     setInvalidName     ] = useState(false);
  const [ invalidEmail,    setInvalidEmail    ] = useState(false);
  const [ invalidPassword, setInvalidPassword ] = useState(false);

  const handleSubmit = async e => {
    let isMounted = true;

    try {
      setShowLoader(true);
      e.preventDefault();
      setErrorMessage('');
      setInvalidName(false);
      setInvalidEmail(false);
      setInvalidPassword(false);
      let errorMessages = [];
      let focusHasBeenSet = false;

      if (!name) {
        errorMessages.push('Name is required.');
        setInvalidName(true);
        if (!focusHasBeenSet) {
          refName.current.focus();
          focusHasBeenSet = true;
        }
      }

      if (!email) {
        errorMessages.push('Email is required.');
        setInvalidEmail(true);
        if (!focusHasBeenSet) {
          refEmail.current.focus();
          focusHasBeenSet = true;
        }
      }

      if (!password) {
        errorMessages.push('Password is required.');
        setInvalidPassword(true);
        if (!focusHasBeenSet) {
          refPassword.current.focus();
          focusHasBeenSet = true;
        }

      } else {

        if (password.length < 6) {
          errorMessages.push('Password must be at least 6 characters long.');
          setInvalidPassword(true);
          if (!focusHasBeenSet) {
            refPassword.current.focus();
            focusHasBeenSet = true;
          }
        }

        if (!/[a-zA-Z]/.test(password)) {
          errorMessages.push('Password must contain a letter.');
          setInvalidPassword(true);
          if (!focusHasBeenSet) {
            refPassword.current.focus();
            focusHasBeenSet = true;
          }
        }

        if (!/[0-9]/.test(password)) {
          errorMessages.push('Password must contain a number.');
          setInvalidPassword(true);
          if (!focusHasBeenSet) {
            refPassword.current.focus();
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

      //===============================================
      // Submit
      //===============================================
      const email_activation_code = generateActivationCode();

      const response = await axios({
        method: 'post',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: '/register',
        data: {
          service_provider_sid: process.env.REACT_APP_SERVICE_PROVIDER_SID,
          provider: 'local',
          email,
          password,
          email_activation_code,
        },
      });
      console.log('CODE: ', email_activation_code);

      localStorage.setItem('jwt', response.data.jwt);
      localStorage.setItem('user_sid', response.data.user_sid);
      localStorage.setItem('account_sid', response.data.account_sid);
      localStorage.setItem('provider', response.data.provider);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('root_domain', response.data.root_domain);

      isMounted = false;
      history.push('/register/verify-your-email');

    } catch (err) {
      setErrorMessage(
        (err.response && err.response.data && err.response.data.msg) ||
        'Something went wrong, please try again.'
      );
      console.error(err.response || err);
    } finally {
      if (isMounted) {
        setShowLoader(false);
      }
    }
  };

  return (
    <SetupTemplate title="Register With Email">
      <Form left onSubmit={handleSubmit}>
        {showLoader ? (
          <Loader height="211px" />
        ) : (
          <>
            <Input
              fullWidth
              type="text"
              name="name"
              id="name"
              placeholder="Your Name"
              value={name}
              onChange={e => setName(e.target.value)}
              ref={refName}
              invalid={invalidName}
              autoFocus
            />
            <Input
              fullWidth
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              ref={refEmail}
              invalid={invalidEmail}
              autoFocus
            />
            <PasswordInput
              allowShowPassword
              name="password"
              id="password"
              placeholder="Password"
              password={password}
              setPassword={setPassword}
              setErrorMessage={setErrorMessage}
              ref={refPassword}
              invalid={invalidPassword}
            />
            {errorMessage && (
              <FormError message={errorMessage} />
            )}
            <Button fullWidth>Continue →</Button>
            <Link to="/register">Go back</Link>
          </>
        )}
      </Form>
    </SetupTemplate>
  );
};

export default RegisterWithEmail;
