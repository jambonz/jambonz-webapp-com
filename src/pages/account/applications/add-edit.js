import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { NotificationDispatchContext } from '../../../contexts/NotificationContext';
import InternalMain from '../../../components/blocks/InternalMain';
import Section from '../../../components/blocks/Section';
import Form from '../../../components/elements/Form';
import Input from '../../../components/elements/Input';
import Label from '../../../components/elements/Label';
import Select from '../../../components/elements/Select';
import InputGroup from '../../../components/elements/InputGroup';
import PasswordInput from '../../../components/elements/PasswordInput';
import FormError from '../../../components/blocks/FormError';
import Button from '../../../components/elements/Button';
import SpeechSynthesisLanguageGoogle from '../../../data/SpeechSynthesisLanguageGoogle';
import SpeechSynthesisLanguageAws from '../../../data/SpeechSynthesisLanguageAws';
import SpeechRecognizerLanguageGoogle from '../../../data/SpeechRecognizerLanguageGoogle';
import SpeechRecognizerLanguageAws from '../../../data/SpeechRecognizerLanguageAws';
import Loader from '../../../components/blocks/Loader';
import CopyableText from '../../../components/elements/CopyableText';

const ApplicationsAddEdit = () => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');
  const account_sid = localStorage.getItem('account_sid');

  const { application_sid } = useParams();
  const type = application_sid ? 'edit' : 'add';
  const pageTitle = type === 'edit' ? 'Edit Application' : 'Add Application';
  useEffect(() => {
    document.title = `${pageTitle} | jambonz`;
  });

  // Refs
  const refName = useRef(null);
  const refCallWebhook = useRef(null);
  const refCallWebhookUser = useRef(null);
  const refCallWebhookPass = useRef(null);
  const refStatusWebhook = useRef(null);
  const refStatusWebhookUser = useRef(null);
  const refStatusWebhookPass = useRef(null);
  const refMessagingWebhookUser = useRef(null);
  const refMessagingWebhookPass = useRef(null);

  // Form inputs
  const [ name,                     setName                     ] = useState('');
  const [ callWebhook,              setCallWebhook              ] = useState('');
  const [ callWebhookMethod,        setCallWebhookMethod        ] = useState('POST');
  const [ callWebhookUser,          setCallWebhookUser          ] = useState('');
  const [ callWebhookPass,          setCallWebhookPass          ] = useState('');
  const [ statusWebhook,            setStatusWebhook            ] = useState('');
  const [ statusWebhookMethod,      setStatusWebhookMethod      ] = useState('POST');
  const [ statusWebhookUser,        setStatusWebhookUser        ] = useState('');
  const [ statusWebhookPass,        setStatusWebhookPass        ] = useState('');
  const [ messagingWebhook,         setMessagingWebhook         ] = useState('');
  const [ messagingWebhookMethod,   setMessagingWebhookMethod   ] = useState('POST');
  const [ messagingWebhookUser,     setMessagingWebhookUser     ] = useState('');
  const [ messagingWebhookPass,     setMessagingWebhookPass     ] = useState('');
  const [ speechSynthesisVendor,    setSpeechSynthesisVendor    ] = useState('google');
  const [ speechSynthesisLanguage,  setSpeechSynthesisLanguage  ] = useState('en-US');
  const [ speechSynthesisVoice,     setSpeechSynthesisVoice     ] = useState('en-US-Standard-C');
  const [ speechRecognizerVendor,   setSpeechRecognizerVendor   ] = useState('google');
  const [ speechRecognizerLanguage, setSpeechRecognizerLanguage ] = useState('en-US');

  // Invalid form inputs
  const [ invalidName,                 setInvalidName                 ] = useState(false);
  const [ invalidCallWebhook,          setInvalidCallWebhook          ] = useState(false);
  const [ invalidCallWebhookUser,      setInvalidCallWebhookUser      ] = useState(false);
  const [ invalidCallWebhookPass,      setInvalidCallWebhookPass      ] = useState(false);
  const [ invalidStatusWebhook,        setInvalidStatusWebhook        ] = useState(false);
  const [ invalidStatusWebhookUser,    setInvalidStatusWebhookUser    ] = useState(false);
  const [ invalidStatusWebhookPass,    setInvalidStatusWebhookPass    ] = useState(false);
  const [ invalidMessagingWebhookUser, setInvalidMessagingWebhookUser ] = useState(false);
  const [ invalidMessagingWebhookPass, setInvalidMessagingWebhookPass ] = useState(false);

  const [ showLoader, setShowLoader ] = useState(true);
  const [ errorMessage, setErrorMessage ] = useState('');

  const [ showCallAuth, setShowCallAuth ] = useState(false);
  const toggleCallAuth = () => setShowCallAuth(!showCallAuth);

  const [ showStatusAuth, setShowStatusAuth ] = useState(false);
  const toggleStatusAuth = () => setShowStatusAuth(!showStatusAuth);

  const [ showMessagingAuth, setShowMessagingAuth ] = useState(false);
  const toggleMessagingAuth = () => setShowMessagingAuth(!showMessagingAuth);

  const [ applicationSid, setApplicationSid ] = useState([]);

  useEffect(() => {
    const getAPIData = async () => {
      let isMounted = true;
      try {
        if (type === 'edit') {
          const application = await axios({
            method: 'get',
            baseURL: process.env.REACT_APP_API_BASE_URL,
            url: `/Applications/${application_sid}`,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });

          const app = application.data[0];

          setName(                     app.name || '');
          setCallWebhook(              (app.call_hook && app.call_hook.url)      || '');
          setCallWebhookMethod(        (app.call_hook && app.call_hook.method)   || 'post');
          setCallWebhookUser(          (app.call_hook && app.call_hook.username) || '');
          setCallWebhookPass(          (app.call_hook && app.call_hook.password) || '');
          setStatusWebhook(            (app.call_status_hook && app.call_status_hook.url)      || '');
          setStatusWebhookMethod(      (app.call_status_hook && app.call_status_hook.method)   || 'post');
          setStatusWebhookUser(        (app.call_status_hook && app.call_status_hook.username) || '');
          setStatusWebhookPass(        (app.call_status_hook && app.call_status_hook.password) || '');
          setMessagingWebhook(         (app.messaging_hook && app.messaging_hook.url)      || '');
          setMessagingWebhookMethod(   (app.messaging_hook && app.messaging_hook.method)   || 'post');
          setMessagingWebhookUser(     (app.messaging_hook && app.messaging_hook.username) || '');
          setMessagingWebhookPass(     (app.messaging_hook && app.messaging_hook.password) || '');
          setSpeechSynthesisVendor(    app.speech_synthesis_vendor    || '');
          setSpeechSynthesisLanguage(  app.speech_synthesis_language  || '');
          setSpeechSynthesisVoice(     app.speech_synthesis_voice     || '');
          setSpeechRecognizerVendor(   app.speech_recognizer_vendor   || '');
          setSpeechRecognizerLanguage( app.speech_recognizer_language || '');
          setApplicationSid(           app.application_sid);
          if (
            (app.call_hook && app.call_hook.username) ||
            (app.call_hook && app.call_hook.password)
          ) {
            setShowCallAuth(true);
          }

          if (
            (app.call_status_hook && app.call_status_hook.username) ||
            (app.call_status_hook && app.call_status_hook.password)
          ) {
            setShowStatusAuth(true);
          }

          if (
            (app.messaging_hook && app.messaging_hook.username) ||
            (app.messaging_hook && app.messaging_hook.password)
          ) {
            setShowMessagingAuth(true);
          }
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
          history.push('/account/applications');
          dispatch({
            type: 'ADD',
            level: 'error',
            message: (err.response && err.response.data && err.response.data.msg) || 'That application does not exist',
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
      setInvalidName(false);
      setInvalidCallWebhook(false);
      setInvalidCallWebhookUser(false);
      setInvalidCallWebhookPass(false);
      setInvalidStatusWebhook(false);
      setInvalidStatusWebhookUser(false);
      setInvalidStatusWebhookPass(false);
      setInvalidMessagingWebhookUser(false);
      setInvalidMessagingWebhookPass(false);
      let errorMessages = [];
      let focusHasBeenSet = false;

      if (!name) {
        errorMessages.push('Please provide a name.');
        setInvalidName(true);
        if (!focusHasBeenSet) {
          refName.current.focus();
          focusHasBeenSet = true;
        }
      }

      if (!callWebhook) {
        errorMessages.push('Please provide a Calling Webhook.');
        setInvalidCallWebhook(true);
        if (!focusHasBeenSet) {
          refCallWebhook.current.focus();
          focusHasBeenSet = true;
        }
      }

      if (!statusWebhook) {
        errorMessages.push('Please provide a Call Status Webhook.');
        setInvalidStatusWebhook(true);
        if (!focusHasBeenSet) {
          refStatusWebhook.current.focus();
          focusHasBeenSet = true;
        }
      }

      if ((callWebhookUser && !callWebhookPass) || (!callWebhookUser && callWebhookPass)) {
        errorMessages.push('Calling Webhook username and password must be either both filled out or both empty.');
        setInvalidCallWebhookUser(true);
        setInvalidCallWebhookPass(true);
        if (!focusHasBeenSet) {
          if (!callWebhookUser) {
            refCallWebhookUser.current.focus();
          } else {
            refCallWebhookPass.current.focus();
          }
          focusHasBeenSet = true;
        }
      }

      if ((statusWebhookUser && !statusWebhookPass) || (!statusWebhookUser && statusWebhookPass)) {
        errorMessages.push('Call Status Webhook username and password must be either both filled out or both empty.');
        setInvalidStatusWebhookUser(true);
        setInvalidStatusWebhookPass(true);
        if (!focusHasBeenSet) {
          if (!statusWebhookUser) {
            refStatusWebhookUser.current.focus();
          } else {
            refStatusWebhookPass.current.focus();
          }
          focusHasBeenSet = true;
        }
      }

      if ((messagingWebhookUser && !messagingWebhookPass) || (!messagingWebhookUser && messagingWebhookPass)) {
        errorMessages.push('Messaging Webhook username and password must be either both filled out or both empty.');
        setInvalidMessagingWebhookUser(true);
        setInvalidMessagingWebhookPass(true);
        if (!focusHasBeenSet) {
          if (!messagingWebhookUser) {
            refMessagingWebhookUser.current.focus();
          } else {
            refMessagingWebhookPass.current.focus();
          }
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

      //=============================================================================
      // Submit
      //=============================================================================
      const method = type === 'add'
        ? 'post'
        : 'put';

      const url = type === 'add'
        ? '/Applications'
        : `/Applications/${applicationSid}`;

      const data = {
        name: name.trim(),
        account_sid,
        call_hook: {
          url: callWebhook.trim(),
          method: callWebhookMethod,
          username: callWebhookUser.trim() || null,
          password: callWebhookPass || null,
        },
        call_status_hook: {
          url: statusWebhook.trim(),
          method: statusWebhookMethod,
          username: statusWebhookUser.trim() || null,
          password: statusWebhookPass || null,
        },
        messaging_hook: {
          url: messagingWebhook.trim(),
          method: messagingWebhookMethod,
          username: messagingWebhookUser.trim() || null,
          password: messagingWebhookPass || null,
        },
        speech_synthesis_vendor:    speechSynthesisVendor,
        speech_synthesis_language:  speechSynthesisLanguage,
        speech_synthesis_voice:     speechSynthesisVoice,
        speech_recognizer_vendor:   speechRecognizerVendor,
        speech_recognizer_language: speechRecognizerLanguage,
      };

      await axios({
        method,
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data,
      });

      isMounted = false;
      history.push('/account/applications');
      const dispatchMessage = type === 'add'
        ? 'Application created successfully'
        : 'Application updated successfully';
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
    <InternalMain
      type="form"
      title={pageTitle}
      breadcrumbs={[
        { name: 'Back to Applications', url: '/account/applications' },
      ]}
    >
      <Section>
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
            {type === 'edit' && (
              <>
                <Label>ApplicationSid</Label>
                <CopyableText text={applicationSid} textType="ApplicationSid" />
              </>
            )}

            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Application name"
              invalid={invalidName}
              autoFocus
              ref={refName}
            />

            <hr />

            <Label htmlFor="callWebhook">Calling Webhook</Label>
            <InputGroup>
              <Input
                name="callWebhook"
                id="callWebhook"
                value={callWebhook}
                onChange={e => setCallWebhook(e.target.value)}
                placeholder="URL that will handle calls"
                invalid={invalidCallWebhook}
                ref={refCallWebhook}
              />

              <Label
                middle
                htmlFor="callWebhookMethod"
              >
                Method
              </Label>
              <Select
                name="callWebhookMethod"
                id="callWebhookMethod"
                value={callWebhookMethod}
                onChange={e => setCallWebhookMethod(e.target.value)}
              >
                <option value="POST">POST</option>
                <option value="GET">GET</option>
              </Select>
            </InputGroup>

            {showCallAuth ? (
              <InputGroup>
                <Label indented htmlFor="callWebhookUser">User</Label>
                <Input
                  name="callWebhookUser"
                  id="callWebhookUser"
                  value={callWebhookUser}
                  onChange={e => setCallWebhookUser(e.target.value)}
                  placeholder="Optional"
                  invalid={invalidCallWebhookUser}
                  ref={refCallWebhookUser}
                />
                <Label htmlFor="callWebhookPass" middle>Password</Label>
                <PasswordInput
                  allowShowPassword
                  name="callWebhookPass"
                  id="callWebhookPass"
                  password={callWebhookPass}
                  setPassword={setCallWebhookPass}
                  setErrorMessage={setErrorMessage}
                  placeholder="Optional"
                  invalid={invalidCallWebhookPass}
                  ref={refCallWebhookPass}
                />
              </InputGroup>
            ) : (
              <Button
                text
                formLink
                type="button"
                onClick={toggleCallAuth}
              >
                Use HTTP Basic Authentication
              </Button>
            )}

            <hr />

            <Label htmlFor="statusWebhook">Call Status Webhook</Label>
            <InputGroup>
              <Input
                name="statusWebhook"
                id="statusWebhook"
                value={statusWebhook}
                onChange={e => setStatusWebhook(e.target.value)}
                placeholder="URL that will receive call status"
                invalid={invalidStatusWebhook}
                ref={refStatusWebhook}
              />

              <Label
                middle
                htmlFor="statusWebhookMethod"
              >
                Method
              </Label>
              <Select
                name="statusWebhookMethod"
                id="statusWebhookMethod"
                value={statusWebhookMethod}
                onChange={e => setStatusWebhookMethod(e.target.value)}
              >
                <option value="POST">POST</option>
                <option value="GET">GET</option>
              </Select>
            </InputGroup>

            {showStatusAuth ? (
              <InputGroup>
                <Label indented htmlFor="statusWebhookUser">User</Label>
                <Input
                  name="statusWebhookUser"
                  id="statusWebhookUser"
                  value={statusWebhookUser}
                  onChange={e => setStatusWebhookUser(e.target.value)}
                  placeholder="Optional"
                  invalid={invalidStatusWebhookUser}
                  ref={refStatusWebhookUser}
                />
                <Label htmlFor="statusWebhookPass" middle>Password</Label>
                <PasswordInput
                  allowShowPassword
                  name="statusWebhookPass"
                  id="statusWebhookPass"
                  password={statusWebhookPass}
                  setPassword={setStatusWebhookPass}
                  setErrorMessage={setErrorMessage}
                  placeholder="Optional"
                  invalid={invalidStatusWebhookPass}
                  ref={refStatusWebhookPass}
                />
              </InputGroup>
            ) : (
              <Button
                text
                formLink
                type="button"
                onClick={toggleStatusAuth}
              >
                Use HTTP Basic Authentication
              </Button>
            )}

            <hr />

            <Label htmlFor="messagingWebhook">Messaging Webhook</Label>
            <InputGroup>
              <Input
                name="messagingWebhook"
                id="messagingWebhook"
                value={messagingWebhook}
                onChange={e => setMessagingWebhook(e.target.value)}
                placeholder="URL that will receive SMS (optional)"
              />

              <Label
                middle
                htmlFor="messagingWebhookMethod"
              >
                Method
              </Label>
              <Select
                name="messagingWebhookMethod"
                id="messagingWebhookMethod"
                value={messagingWebhookMethod}
                onChange={e => setMessagingWebhookMethod(e.target.value)}
              >
                <option value="POST">POST</option>
                <option value="GET">GET</option>
              </Select>
            </InputGroup>

            {showMessagingAuth ? (
              <InputGroup>
                <Label indented htmlFor="messagingWebhookUser">User</Label>
                <Input
                  name="messagingWebhookUser"
                  id="messagingWebhookUser"
                  value={messagingWebhookUser}
                  onChange={e => setMessagingWebhookUser(e.target.value)}
                  placeholder="Optional"
                  invalid={invalidMessagingWebhookUser}
                  ref={refMessagingWebhookUser}
                />
                <Label htmlFor="messagingWebhookPass" middle>Password</Label>
                <PasswordInput
                  allowShowPassword
                  name="messagingWebhookPass"
                  id="messagingWebhookPass"
                  password={messagingWebhookPass}
                  setPassword={setMessagingWebhookPass}
                  setErrorMessage={setErrorMessage}
                  placeholder="Optional"
                  invalid={invalidMessagingWebhookPass}
                  ref={refMessagingWebhookPass}
                />
              </InputGroup>
            ) : (
              <Button
                text
                formLink
                type="button"
                onClick={toggleMessagingAuth}
              >
                Use HTTP Basic Authentication
              </Button>
            )}

            <hr />

            <Label htmlFor="speechSynthesisVendor">Speech Synthesis Vendor</Label>
            <InputGroup>
              <Select
                name="speechSynthesisVendor"
                id="speechSynthesisVendor"
                value={speechSynthesisVendor}
                onChange={e => {
                  setSpeechSynthesisVendor(e.target.value);

                  // When using Google and en-US, ensure "Standard-C" is used as default
                  if (
                    e.target.value === 'google' &&
                    speechSynthesisLanguage === 'en-US'
                  ) {
                    setSpeechSynthesisVoice('en-US-Standard-C');
                    return;
                  }

                  // Google and AWS have different voice lists. See if the newly
                  // chosen vendor has the same language as what was already in use.
                  let newLang = e.target.value === 'google'
                    ? SpeechSynthesisLanguageGoogle.find(l => (
                        l.code === speechSynthesisLanguage
                      ))
                    : SpeechSynthesisLanguageAws.find(l => (
                        l.code === speechSynthesisLanguage
                      ));

                  // if not, use en-US as fallback.
                  if (!newLang) {
                    setSpeechSynthesisLanguage('en-US');

                    if (e.target.value === 'google') {
                      setSpeechSynthesisVoice('en-US-Standard-C');
                      return;
                    }

                    newLang = SpeechSynthesisLanguageAws.find(l => (
                      l.code === 'en-US'
                    ));
                  }

                  // Update state to reflect first voice option for language
                  setSpeechSynthesisVoice(newLang.voices[0].value);
                }}
              >
                <option value="google">Google</option>
                <option value="aws">AWS</option>
              </Select>
              <Label middle htmlFor="speechSynthesisLanguage">Language</Label>
              <Select
                name="speechSynthesisLanguage"
                id="speechSynthesisLanguage"
                value={speechSynthesisLanguage}
                onChange={e => {
                  setSpeechSynthesisLanguage(e.target.value);

                  // When using Google and en-US, ensure "Standard-C" is used as default
                  if (
                    (speechSynthesisVendor === 'google')
                    && (e.target.value === 'en-US')
                  ) {
                    setSpeechSynthesisVoice('en-US-Standard-C');
                    return;
                  }

                  const newLang = speechSynthesisVendor === 'google'
                    ? SpeechSynthesisLanguageGoogle.find(l => (
                        l.code === e.target.value
                      ))
                    : SpeechSynthesisLanguageAws.find(l => (
                        l.code === e.target.value
                      ));

                  setSpeechSynthesisVoice(newLang.voices[0].value);

                }}
              >
                {speechSynthesisVendor === 'google' ? (
                  SpeechSynthesisLanguageGoogle.map(l => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                  ))
                ) : (
                  SpeechSynthesisLanguageAws.map(l => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                  ))
                )}
              </Select>
              <Label middle htmlFor="speechSynthesisVoice">Voice</Label>
              <Select
                name="speechSynthesisVoice"
                id="speechSynthesisVoice"
                value={speechSynthesisVoice}
                onChange={e => setSpeechSynthesisVoice(e.target.value)}
              >
                {speechSynthesisVendor === 'google' ? (
                  SpeechSynthesisLanguageGoogle
                    .filter(l => l.code === speechSynthesisLanguage)
                    .map(m => m.voices.map(v => (
                        <option key={v.value} value={v.value}>{v.name}</option>
                    )))
                ) : (
                  SpeechSynthesisLanguageAws
                      .filter(l => l.code === speechSynthesisLanguage)
                      .map(m => m.voices.map(v => (
                          <option key={v.value} value={v.value}>{v.name}</option>
                      )))
                )}
              </Select>
            </InputGroup>

            <hr />

            <Label htmlFor="speechRecognizerVendor">Speech Recognizer Vendor</Label>
            <InputGroup>
              <Select
                name="speechRecognizerVendor"
                id="speechRecognizerVendor"
                value={speechRecognizerVendor}
                onChange={e => {
                  setSpeechRecognizerVendor(e.target.value);

                  // Google and AWS have different language lists. If the newly chosen
                  // vendor doesn't have the same language that was already in use,
                  // select US English
                  if ((
                    e.target.value === 'google' &&
                    !SpeechRecognizerLanguageGoogle.some(l => l.code === speechRecognizerLanguage)
                  ) || (
                    e.target.value === 'aws' &&
                    !SpeechRecognizerLanguageAws.some(l => l.code === speechRecognizerLanguage)
                  )) {
                    setSpeechRecognizerLanguage('en-US');
                  }
                }}
              >
                <option value="google">Google</option>
                <option value="aws">AWS</option>
              </Select>
              <Label middle htmlFor="speechRecognizerLanguage">Language</Label>
              <Select
                name="speechRecognizerLanguage"
                id="speechRecognizerLanguage"
                value={speechRecognizerLanguage}
                onChange={e => setSpeechRecognizerLanguage(e.target.value)}
              >
                {speechRecognizerVendor === 'google' ? (
                  SpeechRecognizerLanguageGoogle.map(l => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                  ))
                ) : (
                  SpeechRecognizerLanguageAws.map(l => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                  ))
                )}
              </Select>
            </InputGroup>

            {errorMessage && (
              <FormError grid message={errorMessage} />
            )}

            <InputGroup flexEnd spaced>
              <Button
                gray
                type="button"
                onClick={() => {
                  history.push('/account/applications');
                  dispatch({
                    type: 'ADD',
                    level: 'info',
                    message: type === 'add' ? 'New application canceled' :'Changes canceled',
                  });
                }}
              >
                Cancel
              </Button>

              <Button>
                {type === 'add'
                  ? 'Add Application'
                  : 'Save'
                }
              </Button>
            </InputGroup>
          </Form>
        )}
      </Section>
    </InternalMain>
  );
};

export default ApplicationsAddEdit;
