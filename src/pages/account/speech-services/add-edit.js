import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { NotificationDispatchContext } from '../../../contexts/NotificationContext';
import InternalTemplate from '../../../components/templates/InternalTemplate';
import Form from '../../../components/elements/Form';
import Input from '../../../components/elements/Input';
import Label from '../../../components/elements/Label';
import InputGroup from '../../../components/elements/InputGroup';
import PasswordInput from '../../../components/elements/PasswordInput';
import Radio from '../../../components/elements/Radio';
import Checkbox from '../../../components/elements/Checkbox';
import FormError from '../../../components/blocks/FormError';
import Button from '../../../components/elements/Button';
import Loader from '../../../components/blocks/Loader';

const SpeechServicesAddEdit = () => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');
  const account_sid = localStorage.getItem('account_sid');

  const { speech_credential_sid } = useParams();
  const type = speech_credential_sid ? 'edit' : 'add';
  const pageTitle = type === 'edit' ? 'Edit Speech Service' : 'Add Speech Service';
  useEffect(() => {
    document.title = `${pageTitle} | jambonz`;
  });

  // Refs
  const refVendorGoogle = useRef(null);
  const refVendorAws = useRef(null);
  const refServiceKey = useRef(null);
  const refAccessKeyId = useRef(null);
  const refSecretAccessKey = useRef(null);
  const refUseForTts = useRef(null);
  const refUseForStt = useRef(null);

  // Form inputs
  const [ vendor,          setVendor          ] = useState('');
  const [ serviceKey,      setServiceKey      ] = useState('');
  const [ accessKeyId,     setAccessKeyId     ] = useState('');
  const [ secretAccessKey, setSecretAccessKey ] = useState('');
  const [ useForTts,       setUseForTts       ] = useState(false);
  const [ useForStt,       setUseForStt       ] = useState(false);

  // Invalid form inputs
  const [ invalidVendorGoogle,    setInvalidVendorGoogle    ] = useState(false);
  const [ invalidVendorAws,       setInvalidVendorAws       ] = useState(false);
  const [ invalidServiceKey,      setInvalidServiceKey      ] = useState(false);
  const [ invalidAccessKeyId,     setInvalidAccessKeyId     ] = useState(false);
  const [ invalidSecretAccessKey, setInvalidSecretAccessKey ] = useState(false);
  const [ invalidUseForTts,       setInvalidUseForTts       ] = useState(false);
  const [ invalidUseForStt,       setInvalidUseForStt       ] = useState(false);

  const [ showLoader, setShowLoader ] = useState(true);
  const [ errorMessage, setErrorMessage ] = useState('');

  useEffect(() => {
    const getAPIData = async () => {
      let isMounted = true;
      try {
        if (type === 'edit') {
          const speechCredential = await axios({
            method: 'get',
            baseURL: process.env.REACT_APP_API_BASE_URL,
            url: `/Accounts/${account_sid}/SpeechCredentials/${speech_credential_sid}`,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });

          setVendor(          speechCredential.data.vendor            || undefined);
          setServiceKey(      speechCredential.data.service_key       || '');
          setAccessKeyId(     speechCredential.data.access_key_id     || '');
          setSecretAccessKey( speechCredential.data.secret_access_key || '');
          setUseForTts(       speechCredential.data.use_for_tts       || false);
          setUseForStt(       speechCredential.data.use_for_stt       || false);
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
          history.push('/account/speech-services');
          dispatch({
            type: 'ADD',
            level: 'error',
            message: (err.response && err.response.data && err.response.data.msg) || 'That speech service does not exist',
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
      setInvalidVendorGoogle(false);
      setInvalidVendorAws(false);
      setInvalidServiceKey(false);
      setInvalidAccessKeyId(false);
      setInvalidSecretAccessKey(false);
      setInvalidUseForTts(false);
      setInvalidUseForStt(false);
      let errorMessages = [];
      let focusHasBeenSet = false;

      if (!vendor) {
        errorMessages.push('Please select a vendor.');
        setInvalidVendorGoogle(true);
        setInvalidVendorAws(true);
        if (!focusHasBeenSet) {
          refVendorGoogle.current.focus();
          focusHasBeenSet = true;
        }
      }

      if (vendor === 'google' && !serviceKey) {
        errorMessages.push('Please provide a service key.');
        setInvalidServiceKey(true);
        if (!focusHasBeenSet) {
          refServiceKey.current.focus();
          focusHasBeenSet = true;
        }
      }

      if (vendor === 'aws' && !accessKeyId) {
        errorMessages.push('Please provide an access key ID.');
        setInvalidAccessKeyId(true);
        if (!focusHasBeenSet) {
          refAccessKeyId.current.focus();
          focusHasBeenSet = true;
        }
      }

      if (vendor === 'aws' && !secretAccessKey) {
        errorMessages.push('Please provide a secret access key.');
        setInvalidSecretAccessKey(true);
        if (!focusHasBeenSet) {
          refSecretAccessKey.current.focus();
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

      // Check if user already has a speech service with the selected vendor
      const speechServices = await axios({
        method: 'get',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Accounts/${account_sid}/SpeechCredentials`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (speechServices.data.some(speech => speech.vendor === vendor)) {
        setErrorMessage('You can only have one speech credential per vendor.');
        setShowLoader(false);
        if (vendor === 'google') {
          setInvalidVendorGoogle(true);
          if (!focusHasBeenSet) {
            refVendorGoogle.current.focus();
          }
        } else if (vendor === 'aws') {
          setInvalidVendorAws(true);
          if (!focusHasBeenSet) {
            refVendorAws.current.focus();
          }
        }
        return;
      }

      //===============================================
      // Submit
      //===============================================
      const method = type === 'add'
        ? 'post'
        : 'put';

      const url = type === 'add'
        ? `/Accounts/${account_sid}/SpeechCredentials`
        : `/Accounts/${account_sid}/SpeechCredentials/${speech_credential_sid}`;

      await axios({
        method,
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data: {
          vendor,
          service_key: vendor === 'google' ? serviceKey : null,
          access_key_id: vendor === 'aws' ? accessKeyId : null,
          secret_access_key: vendor === 'aws' ? secretAccessKey : null,
          use_for_tts: useForTts,
          use_for_stt: useForStt,
        }
      });

      isMounted = false;
      history.push('/account/speech-services');
      const dispatchMessage = type === 'add'
        ? 'Speech service created successfully'
        : 'Speech service updated successfully';
      dispatch({
        type: 'ADD',
        level: 'success',
        message: dispatchMessage
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
    <InternalTemplate
      type="form"
      title={pageTitle}
      breadcrumbs={[
        { name: 'Back to Speech Services', url: '/account/speech-services' },
      ]}
    >
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
          <span>Vendor</span>
          <InputGroup>
            <Radio
              noLeftMargin
              name="vendor"
              id="google"
              label="Google"
              checked={vendor === 'google'}
              onChange={() => setVendor('google')}
              invalid={invalidVendorGoogle}
              ref={refVendorGoogle}
              disabled={type === 'edit'}
            />

            <Radio
              name="vendor"
              id="aws"
              label="Amazon Web Services"
              checked={vendor === 'aws'}
              onChange={() => setVendor('aws')}
              invalid={invalidVendorAws}
              ref={refVendorAws}
              disabled={type === 'edit'}
            />
          </InputGroup>

          {vendor === 'google' ? (
            <>
              <Label htmlFor="serviceKey">Service Key</Label>
              <Input
                name="serviceKey"
                id="serviceKey"
                value={serviceKey}
                onChange={e => setServiceKey(e.target.value)}
                placeholder=""
                invalid={invalidServiceKey}
                ref={refServiceKey}
                disabled={type === 'edit'}
              />
            </>
          ) : vendor === 'aws' ? (
            <>
              <Label htmlFor="accessKeyId">Access Key ID</Label>
              <Input
                name="accessKeyId"
                id="accessKeyId"
                value={accessKeyId}
                onChange={e => setAccessKeyId(e.target.value)}
                placeholder=""
                invalid={invalidAccessKeyId}
                ref={refAccessKeyId}
                disabled={type === 'edit'}
              />

              <Label htmlFor="secretAccessKey">Secret Access Key</Label>
              <PasswordInput
                allowShowPassword
                name="secretAccessKey"
                id="secretAccessKey"
                password={secretAccessKey}
                setPassword={setSecretAccessKey}
                setErrorMessage={setErrorMessage}
                invalid={invalidSecretAccessKey}
                ref={refSecretAccessKey}
                disabled={type === 'edit'}
              />
            </>
          ) : (
            null
          )}

          {vendor === 'google' || vendor === 'aws' ? (
            <>
              <div></div>

              <Checkbox
                noLeftMargin
                name="useForTts"
                id="useForTts"
                label="Use for text-to-speech"
                checked={useForTts}
                onChange={e => setUseForTts(e.target.checked)}
                invalid={invalidUseForTts}
                ref={refUseForTts}
              />

              <div></div>

              <Checkbox
                noLeftMargin
                name="useForStt"
                id="useForStt"
                label="Use for speech-to-text"
                checked={useForStt}
                onChange={e => setUseForStt(e.target.checked)}
                invalid={invalidUseForStt}
                ref={refUseForStt}
              />
            </>
          ) : (
            null
          )}

          {errorMessage && (
            <FormError grid message={errorMessage} />
          )}

          <InputGroup flexEnd spaced>
            <Button
              grid
              gray
              type="button"
              onClick={() => {
                history.push('/account/speech-services');
                dispatch({
                  type: 'ADD',
                  level: 'info',
                  message: type === 'add' ? 'New speech service canceled' :'Changes canceled',
                });
              }}
            >
              Cancel
            </Button>

            <Button grid>
              {type === 'add'
                ? 'Add Speech Service'
                : 'Save'
              }
            </Button>
          </InputGroup>
        </Form>
      )}
    </InternalTemplate>
  );
};

export default SpeechServicesAddEdit;
