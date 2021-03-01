import { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ExternalMain from '../../components/wrappers/ExternalMain';
import Form from '../../components/elements/Form';
import Button from '../../components/elements/Button';
import Link from '../../components/elements/Link';
import Input from '../../components/elements/Input';
import PasswordInput from '../../components/elements/PasswordInput';
import FormError from '../../components/blocks/FormError';

const SignIn = props => {
  let history = useHistory();

  // Clean up OAuth localStorage since the user is using email
  localStorage.removeItem('oauth-state');
  localStorage.removeItem('location-before-oauth');

  // Refs
  const refEmail = useRef(null);
  const refPassword = useRef(null);

  // Form inputs
  const [ email,        setEmail        ] = useState('');
  const [ password,     setPassword     ] = useState('');
  const [ errorMessage, setErrorMessage ] = useState('');

  // Invalid form inputs
  const [ invalidEmail, setInvalidEmail ] = useState(false);
  const [ invalidPassword, setInvalidPassword ] = useState(false);

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      setErrorMessage('');
      setInvalidEmail(false);
      setInvalidPassword(false);

      if (!email && !password) {
        setErrorMessage('Email and password are required');
        setInvalidEmail(true);
        setInvalidPassword(true);
        refEmail.current.focus();
        return;
      }
      if (!email) {
        setErrorMessage('Email is required');
        setInvalidEmail(true);
        refEmail.current.focus();
        return;
      }

      if (!password) {
        setErrorMessage('Password is required');
        setInvalidPassword(true);
        refPassword.current.focus();
        return;
      }

      // Sign in
      const response = await axios({
        method: 'post',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: '/signin',
        data: { email, password },
      });

      localStorage.setItem('jwt', response.data.jwt);
      localStorage.setItem('user_sid', response.data.user_sid);
      localStorage.setItem('account_sid', response.data.account_sid);

      history.push('/account');

    } catch (err) {
      setErrorMessage(
        (err.response && err.response.data && err.response.data.msg) ||
        'Username and/or password are incorrect.'
      );
      console.error(err.response || err);
    }
  };

  return (
    <ExternalMain title="Sign In With Email">
      <Form left onSubmit={handleSubmit}>
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
        <Button
          fullWidth
        >
          Sign In
        </Button>
        <p>
          <Link to="/">Sign in another way</Link>
        </p>
      </Form>
    </ExternalMain>
  );
};

export default SignIn;
