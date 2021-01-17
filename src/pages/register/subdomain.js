import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import SetupTemplate from '../../components/templates/SetupTemplate';
import Form from '../../components/elements/Form';
import Button from '../../components/elements/Button';
import Input from '../../components/elements/Input';
import FormError from '../../components/blocks/FormError';
import FormParagraph from '../../components/elements/FormParagraph';
import Loader from '../../components/blocks/Loader';

const RegisterChooseSubdomain = () => {
  let history = useHistory();

  // Refs
  const refSubdomain = useRef(null);

  // Form inputs
  const [ subdomain, setSubdomain ] = useState('');

  // Invalid form inputs
  const [ invalidSubdomain, setInvalidSubdomain ] = useState(false);

  const [ showLoader, setShowLoader ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState('');

  useEffect(() => {
    document.title = 'Choose a Subdomain | Register | Jambonz';
  });


  const handleSubmit = async (e) => {
    let isMounted = true;

    try {
      setShowLoader(true);
      e.preventDefault();
      setErrorMessage('');
      setInvalidSubdomain(false);

      if (!subdomain) {
        setErrorMessage('Subdomain is required.');
        setInvalidSubdomain(true);
        refSubdomain.current.focus();
        return;
      }

      if (subdomain.length < 3) {
        setErrorMessage('Subdomain must be at least 3 characters long.');
        setInvalidSubdomain(true);
        refSubdomain.current.focus();
        return;
      }

      if (subdomain.length > 64) {
        setErrorMessage('Subdomain must not be more than 64 characters long.');
        setInvalidSubdomain(true);
        refSubdomain.current.focus();
        return;
      }

      if (!/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(subdomain)) {
        setErrorMessage('Invalid subdomain.');
        setInvalidSubdomain(true);
        refSubdomain.current.focus();
        return;
      }

      //===============================================
      // Submit
      //===============================================
      const root_domain = localStorage.getItem('root_domain');
      const jwt         = localStorage.getItem('jwt');
      const account_sid = localStorage.getItem('account_sid');

      const availabilityResponse = await axios({
        method: 'get',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Availability/?type=subdomain&value=${subdomain}.${root_domain}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (availabilityResponse.data.available !== true) {
        setErrorMessage('That subdomain is not available.');
        setInvalidSubdomain(true);
        setShowLoader(false);
        refSubdomain.current.focus();
        return;
      }

      const createResponse = await axios({
        method: 'POST',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Accounts/${account_sid}/SipRealms/${subdomain}.${root_domain}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (createResponse.status !== 204) {
        throw new Error(`Unable to save subdomain. Please try a different subdomain.`);
      }

      isMounted = false;
      history.push('/register/mobile-number');

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
    <SetupTemplate title="Choose a Subdomain">
      <Form left onSubmit={handleSubmit}>
        {showLoader ? (
          <Loader height="161px" />
        ) : (
          <>
            <FormParagraph>
              This will be the FQDN where your SIP trunking providers
              will send calls, and where you can register devices to.
              This can be changed at any time.
            </FormParagraph>
            <Input
              fullWidth
              type="text"
              name="subdomain"
              id="subdomain"
              placeholder="your-name-here"
              value={subdomain}
              onChange={e => setSubdomain(e.target.value)}
              ref={refSubdomain}
              invalid={invalidSubdomain}
              autoFocus
            />
            {errorMessage && (
              <FormError message={errorMessage} />
            )}
            <Button fullWidth>Continue →</Button>
          </>
        )}
      </Form>
    </SetupTemplate>
  );
};

export default RegisterChooseSubdomain;
