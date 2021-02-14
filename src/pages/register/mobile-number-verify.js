import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ExternalTemplate from '../../components/templates/ExternalTemplate';
import Section from '../../components/blocks/Section';
import Form from '../../components/elements/Form';
import Button from '../../components/elements/Button';
import Link from '../../components/elements/Link';
import Input from '../../components/elements/Input';
import FormError from '../../components/blocks/FormError';
import Loader from '../../components/blocks/Loader';
import phoneNumberFormat from '../../helpers/phoneNumberFormat';

const RegisterMobileNumberVerify = () => {
  let history = useHistory();
  useEffect(() => {
    document.title = `Verify Your Mobile | jambonz`;
  });

  const jwt = localStorage.getItem('jwt');
  const mobile = localStorage.getItem('mobile');
  const user_sid = localStorage.getItem('user_sid');

  // Refs
  const refCode = useRef(null);

  // Form inputs
  const [ code, setCode ] = useState('');

  const [ showLoader, setShowLoader ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState('');

  // Invalid form inputs
  const [ invalidCode, setInvalidCode ] = useState(false);

  const handleSubmit = async e => {
    let isMounted = true;

    try {
      setShowLoader(true);
      e.preventDefault();
      setErrorMessage('');
      setInvalidCode(false);

      if (!code) {
        setErrorMessage('Code is required.');
        setInvalidCode(true);
        refCode.current.focus();
        return;
      }

      //===============================================
      // Submit
      //===============================================
      const activationResponse = await axios({
        method: 'put',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/ActivationCode/${code}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data: {
          user_sid,
          type: 'phone',
        },
      });

      if (activationResponse.status !== 204) {
        throw new Error(`Unable to verify mobile number. Please try again.`);
      }

      isMounted = false;
      history.push('/register/complete');

    } catch (err) {
      setErrorMessage(
        (err.response && err.response.data && err.response.data.msg) ||
        err.message || 'Something went wrong, please try again.'
      );
      console.error(err.response || err);
    } finally {
      if (isMounted) {
        setShowLoader(false);
      }
    }
  };

  return (
    <ExternalTemplate title="Verify Your Mobile">
      <Section>
        <Form left onSubmit={handleSubmit}>
          {showLoader ? (
            <Loader height="142px" />
          ) : (
            <>
              <p>Please enter the code we just sent to {phoneNumberFormat(mobile)}</p>
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
                <Link to="/register/mobile-number">Go Back</Link>
              </p>
            </>
          )}
        </Form>
      </Section>
    </ExternalTemplate>
  );
};

export default RegisterMobileNumberVerify;
