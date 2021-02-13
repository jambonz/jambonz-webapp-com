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
import FileUpload from '../../../components/elements/FileUpload';
import Code from '../../../components/elements/Code';
import FormError from '../../../components/blocks/FormError';
import Button from '../../../components/elements/Button';
import Loader from '../../../components/blocks/Loader';

const SpeechServicesAddEdit = () => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');
  const account_sid = localStorage.getItem('account_sid');

  let { speech_credential_sid } = useParams();
  const type = speech_credential_sid ? 'edit' : 'add';
  const pageTitle = type === 'edit' ? 'Edit Speech Service' : 'Add Speech Service';
  useEffect(() => {
    document.title = `${pageTitle} | jambonz`;
  });

  // Refs
  const refVendorGoogle = useRef(null);
  const refVendorAws = useRef(null);
  const refAccessKeyId = useRef(null);
  const refSecretAccessKey = useRef(null);
  const refUseForTts = useRef(null);
  const refUseForStt = useRef(null);

  // Form inputs
  const [ vendor,              setVendor              ] = useState('');
  const [ serviceKey,          setServiceKey          ] = useState('');
  const [ displayedServiceKey, setDisplayedServiceKey ] = useState('');
  const [ accessKeyId,         setAccessKeyId         ] = useState('');
  const [ secretAccessKey,     setSecretAccessKey     ] = useState('');
  const [ useForTts,           setUseForTts           ] = useState(false);
  const [ useForStt,           setUseForStt           ] = useState(false);

  // Invalid form inputs
  const [ invalidVendorGoogle,    setInvalidVendorGoogle    ] = useState(false);
  const [ invalidVendorAws,       setInvalidVendorAws       ] = useState(false);
  const [ invalidAccessKeyId,     setInvalidAccessKeyId     ] = useState(false);
  const [ invalidSecretAccessKey, setInvalidSecretAccessKey ] = useState(false);
  const [ invalidUseForTts,       setInvalidUseForTts       ] = useState(false);
  const [ invalidUseForStt,       setInvalidUseForStt       ] = useState(false);

  const [ originalTtsValue,       setOriginalTtsValue       ] = useState(null);
  const [ originalSttValue,       setOriginalSttValue       ] = useState(null);

  const [ validServiceKey,        setValidServiceKey        ] = useState(false);

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

          let serviceKeyJson = '';
          let displayedServiceKeyJson = '';

          try {
            serviceKeyJson = JSON.parse(speechCredential.data.service_key);
            displayedServiceKeyJson = JSON.stringify(serviceKeyJson, null, 2);
          } catch (err) {
          }

          setVendor(              speechCredential.data.vendor            || undefined);
          setServiceKey(          serviceKeyJson                          || '');
          setDisplayedServiceKey( displayedServiceKeyJson                 || '');
          setAccessKeyId(         speechCredential.data.access_key_id     || '');
          setSecretAccessKey(     speechCredential.data.secret_access_key || '');
          setUseForTts(           speechCredential.data.use_for_tts       || false);
          setUseForStt(           speechCredential.data.use_for_stt       || false);
          setOriginalTtsValue(    speechCredential.data.use_for_tts       || false);
          setOriginalSttValue(    speechCredential.data.use_for_stt       || false);
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

  const handleFileUpload = async (e) => {
    setErrorMessage('');
    setServiceKey('');
    setDisplayedServiceKey('');

    const file = e.target.files[0];

    if (!file) {
      setValidServiceKey(false);
      return;
    }

    const fileAsText = await file.text();

    try {
      const fileJson = JSON.parse(fileAsText);

      if (!fileJson.client_email || !fileJson.private_key) {
        setValidServiceKey(false);
        setErrorMessage('Invalid service key file, missing data.');
        return;
      }

      setValidServiceKey(true);
      setServiceKey(fileJson);
      setDisplayedServiceKey(JSON.stringify(fileJson, null, 2));

    } catch (err) {
      setValidServiceKey(false);
      setErrorMessage('Invalid service key file, could not parse as JSON.');
    }
  };

  const handleSubmit = async (e) => {
    let isMounted = true;
    try {
      setShowLoader(true);
      e.preventDefault();
      setErrorMessage('');
      setInvalidVendorGoogle(false);
      setInvalidVendorAws(false);
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
        errorMessages.push('Please upload a service key file.');
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

      if (type === 'add' && speechServices.data.some(speech => speech.vendor === vendor)) {
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

      const postResults = await axios({
        method,
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data: {
          vendor,
          service_key: vendor === 'google' ? JSON.stringify(serviceKey) : null,
          access_key_id: vendor === 'aws' ? accessKeyId : null,
          secret_access_key: vendor === 'aws' ? secretAccessKey : null,
          use_for_tts: useForTts,
          use_for_stt: useForStt,
        }
      });

      if (type === 'add') {
        if (!postResults.data || !postResults.data.sid) {
          throw new Error('Error retrieving response data');
        }

        speech_credential_sid = postResults.data.sid;
      }

      //===============================================
      // Test speech credentials
      //===============================================
      if (useForTts || useForStt) {
        const testResults = await axios({
          method: 'get',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: `/Accounts/${account_sid}/SpeechCredentials/${speech_credential_sid}/test`,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (useForTts && testResults.data.tts.status === 'not tested') {
          errorMessages.push('text-to-speech was not tested, please try again.');
        }

        if (useForStt && testResults.data.stt.status === 'not tested') {
          errorMessages.push('speech-to-text was not tested, please try again.');
        }

        const ttsReason = (useForTts && testResults.data.tts.status === 'fail')
          ? testResults.data.tts.reason
          : null;

        const sttReason = (useForStt && testResults.data.stt.status === 'fail')
          ? testResults.data.stt.reason
          : null;

        if (ttsReason && (ttsReason === sttReason)) {
          errorMessages.push(ttsReason);
        } else {
          if (ttsReason) {
            errorMessages.push(`Text-to-speech error: ${ttsReason}`);
          }

          if (sttReason) {
            errorMessages.push(`Speech-to-text error: ${sttReason}`);
          }
        }

        if (errorMessages.length > 1) {
          setErrorMessage(errorMessages);
        } else if (errorMessages.length === 1) {
          setErrorMessage(errorMessages[0]);
        }

        if (errorMessages.length) {
          if (type === 'add') {
            await axios({
              method: 'delete',
              baseURL: process.env.REACT_APP_API_BASE_URL,
              url: `/Accounts/${account_sid}/SpeechCredentials/${speech_credential_sid}`,
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            });
          }

          if (type === 'edit') {
            await axios({
              method,
              baseURL: process.env.REACT_APP_API_BASE_URL,
              url,
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
              data: {
                use_for_tts: originalTtsValue,
                use_for_stt: originalSttValue,
              }
            });
          }

          return;
        }
      }

      //===============================================
      // If successful, go to speech services
      //===============================================
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
        setErrorMessage((err.response && err.response.data && err.response.data.msg) || err.message || 'Something went wrong, please try again.');
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
            type === 'add' && !vendor
              ? '152px'
              : '364px'
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
              {type === 'add' && (
                <FileUpload
                  id="serviceKey"
                  onChange={handleFileUpload}
                  validFile={validServiceKey}
                />
              )}
              {displayedServiceKey && (
                <>
                  {type === 'add' && (
                    <span></span>
                  )}
                  <Code>{displayedServiceKey}</Code>
                </>
              )}
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
