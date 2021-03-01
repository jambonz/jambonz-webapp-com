import { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ExternalMain from '../../components/wrappers/ExternalMain';
import Form from '../../components/elements/Form';
import Button from '../../components/elements/Button';
import Link from '../../components/elements/Link';
import Input from '../../components/elements/Input';
import FormError from '../../components/blocks/FormError';
import Loader from '../../components/blocks/Loader';

const EmailVerify = () => {
  let history = useHistory();

  // Refs
  const refCode = useRef(null);

  // Form inputs
  const [ code, setCode ] = useState('');

  // Invalid form inputs
  const [ invalidCode, setInvalidCode ] = useState(false);

  const [ showLoader, setShowLoader ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState('');

  const jwt = localStorage.getItem('jwt');
  const email = localStorage.getItem('email');
  const user_sid = localStorage.getItem('user_sid');

  const handleSubmit = async (e) => {
    let isMounted = true;

    try {
      setShowLoader(true);
      e.preventDefault();
      setErrorMessage('');
      setInvalidCode(false);

      if (!code) {
        setErrorMessage('Verification code is required.');
        setInvalidCode(true);
        refCode.current.focus();
        return;
      }

      //===============================================
      // Submit
      //===============================================
      const response = await axios({
        method: 'put',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/ActivationCode/${code}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data: {
          user_sid,
          type: 'email',
        },
      });

      if (response.status !== 204) {
        throw new Error(`Unable to verify email. Please try again.`);
      }

      isMounted = false;
      history.push('/register/choose-a-subdomain');

    } catch (err) {
      setErrorMessage(
        (err.response && err.response.data && err.response.data.msg) ||
        err.message || 'Something went wrong, please try again.'
      );
      console.error(err.response || err);

    } finally {

      localStorage.removeItem('email');

      if (isMounted) {
        setShowLoader(false);
      }
    }
  };

  return (
    <ExternalMain title="Verify Your Email">
      <Form left onSubmit={handleSubmit}>
        {showLoader ? (
          <Loader height="161px" />
        ) : (
          <>
            {email ? (
              <p style={{ overflowWrap: 'anywhere' }}>Please enter the code we just sent to {email}</p>
            ) : (
              null
            )}
            <Input
              fullWidth
              type="text"
              name="code"
              id="code"
              placeholder="Verification Code"
              value={code}
              onChange={e => setCode(e.target.value)}
              ref={refCode}
              invalid={invalidCode}
              autoFocus
            />
            {errorMessage && (
              <FormError message={errorMessage} />
            )}
            <Button fullWidth>Continue →</Button>
            <p>
              <Link to="/register/email">Go back</Link>
            </p>
          </>
        )}
      </Form>
    </ExternalMain>
  );
};

export default EmailVerify;
