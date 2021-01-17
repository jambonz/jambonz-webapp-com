import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import SetupTemplate from '../../components/templates/SetupTemplate';
import Form from '../../components/elements/Form';
import Button from '../../components/elements/Button';
import Link from '../../components/elements/Link';
import Input from '../../components/elements/Input';
import FormError from '../../components/blocks/FormError';
import FormParagraph from '../../components/elements/FormParagraph';
import Loader from '../../components/blocks/Loader';
import generateActivationCode from '../../helpers/generateActivationCode';

const RegisterMobileNumber = () => {
  let history = useHistory();
  useEffect(() => {
    document.title = `Mobile Number | Jambonz`;
  });

  const jwt = localStorage.getItem('jwt');
  const user_sid = localStorage.getItem('user_sid');

  // Refs
  const refMobile = useRef(null);

  // Form inputs
  const [ mobile, setMobile ] = useState('');

  const [ showLoader, setShowLoader ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState('');

  // Invalid form inputs
  const [ invalidMobile, setInvalidMobile ] = useState(false);

  const invalidCharacters = /[^0-9-()\s+]/g;
  const nonDigits = /[^0-9]/g;
  const validUsNum = /^1?[2-9][0-9]{2}[2-9][0-9]{6}$/;

  const handleKeyDown = async (e) => {
    if (e.key.length > 1 || e.ctrlKey) {
      // the user pressed a special key like ctrl or shift (e.g. "Ctrl+A")
      return;
    }

    if (invalidCharacters.test(e.key)) {
      setErrorMessage('The only accepted characters are: 0-9 - + ( )');
      setInvalidMobile(true);
    } else {
      setErrorMessage('');
      setInvalidMobile(false);
    }
  };

  const handleChange = async (e) => {
    const value = e.target.value.replace(invalidCharacters, '');
    setMobile(value);
  };

  const handleSubmit = async e => {
    let isMounted = true;

    try {
      setShowLoader(true);
      e.preventDefault();
      setErrorMessage('');
      setInvalidMobile(false);

      if (!mobile) {
        isMounted = false;
        history.push('/register/complete');
        return;
      }

      const cleanMobileNumber = mobile.replace(nonDigits, '');

      if (!validUsNum.test(cleanMobileNumber)) {
        setErrorMessage(['Invalid US number.', 'Please use the format NXX-NXX-XXXX where:', 'N is a digit between 2 and 9, and', 'X is any digit between 0 and 9']);
        setInvalidMobile(true);
        refMobile.current.focus();
        return;
      }

      //===============================================
      // Submit
      //===============================================
      const availabilityResponse = await axios({
        method: 'get',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Availability/?type=phone&value=${cleanMobileNumber}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!availabilityResponse.data.available) {
        setErrorMessage('That mobile number is already in use on another account. Please enter a different mobile number.');
        setInvalidMobile(true);
        setShowLoader(false);
        refMobile.current.focus();
        return;
      }

      const code = generateActivationCode();

      const activationCodeResponse = await axios({
        method: 'post',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: '/ActivationCode',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data: {
          code,
          user_sid,
          type: 'phone',
          value: cleanMobileNumber,
        },
      });

      if (activationCodeResponse.status !== 204) {
        throw new Error(`Unable to save mobile number. Please try a different number.`);
      }

      localStorage.setItem('mobile', cleanMobileNumber);

      isMounted = false;
      history.push('/register/verify-your-mobile-number');

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
    <SetupTemplate title="Mobile Number">
      <Form left onSubmit={handleSubmit}>
        {showLoader ? (
          <Loader height="199px" />
        ) : (
          <>
            <FormParagraph>
              Adding your mobile number will allow you to make test callsfrom
              your mobile without a paid plan. If you provide your number, we
              will send you a verification text message.
            </FormParagraph>
            <Input
              fullWidth
              type="text"
              name="mobile"
              id="mobile"
              placeholder="US Mobile Number (Optional)"
              value={mobile}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              ref={refMobile}
              invalid={invalidMobile}
              autoFocus
            />
            {errorMessage && (
              <FormError message={errorMessage} />
            )}
            <Button fullWidth>Continue →</Button>
            <Link to="/register/complete">Maybe Later</Link>
          </>
        )}
      </Form>
    </SetupTemplate>
  );
};

export default RegisterMobileNumber;
