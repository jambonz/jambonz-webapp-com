import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ExternalTemplate from '../../components/templates/ExternalTemplate';
import Section from '../../components/blocks/Section';
import Form from '../../components/elements/Form';
import Button from '../../components/elements/Button';
import Input from '../../components/elements/Input';
import FormError from '../../components/blocks/FormError';
import Loader from '../../components/blocks/Loader';

const RegisterChooseSubdomain = () => {
  let history = useHistory();

  // Refs
  const refSubdomain = useRef(null);

  // Form inputs
  const [ subdomain, setSubdomain ] = useState('');

  // Invalid form inputs
  const [ invalidSubdomain, setInvalidSubdomain ] = useState(false);

  const [ quickValid, setQuickValid ] = useState(null);
  const [ showLoader, setShowLoader ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState('');

  useEffect(() => {
    document.title = 'Choose a Subdomain | jambonz';
  });

  const jwt = localStorage.getItem('jwt');
  const root_domain = localStorage.getItem('root_domain');
  const account_sid = localStorage.getItem('account_sid');

  const subdomainValidation = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;

  const handleChange = async (e) => {
    setSubdomain(e.target.value);
    setInvalidSubdomain(false);
    setErrorMessage('');

    if (subdomainValidation.test(e.target.value)) {
      const availabilityResponse = await axios({
        method: 'get',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Availability/?type=subdomain&value=${e.target.value}.${root_domain}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (availabilityResponse.data.available) {
        setQuickValid(true);
      } else {
        setQuickValid(false);
      }
      return;
    }

    setQuickValid(null);
  };

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
        setErrorMessage('Subdomains can only include lower case letters, numbers, and hyphens. Hyphens cannot be used as the first or last characters.');
        setInvalidSubdomain(true);
        refSubdomain.current.focus();
        return;
      }

      //===============================================
      // Submit
      //===============================================
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
      history.push('/account');

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
    <ExternalTemplate title="Choose a Subdomain">
      <Section>
        <Form left onSubmit={handleSubmit}>
          {showLoader ? (
            <Loader height="161px" />
          ) : (
            <>
              <p>
                This will be the FQDN where your carrier will
                send calls, and where you can register devices
                to. This can be changed at any time.
              </p>
              <Input
                fullWidth
                type="text"
                name="subdomain"
                id="subdomain"
                placeholder="your-name-here"
                value={subdomain}
                onChange={handleChange}
                ref={refSubdomain}
                invalid={invalidSubdomain}
                quickValid={quickValid}
                autoFocus
              />
              {subdomain &&
                <p>
                  FQDN: {subdomain}.{root_domain}
                </p>
              }
              {errorMessage && (
                <FormError message={errorMessage} />
              )}
              <Button fullWidth>Complete Registration →</Button>
            </>
          )}
        </Form>
      </Section>
    </ExternalTemplate>
  );
};

export default RegisterChooseSubdomain;
