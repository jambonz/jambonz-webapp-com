import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { NotificationDispatchContext } from '../../../contexts/NotificationContext';
import InternalTemplate from '../../../components/templates/InternalTemplate';
import Form from '../../../components/elements/Form';
import Input from '../../../components/elements/Input';
import PasswordInput from '../../../components/elements/PasswordInput';
import Label from '../../../components/elements/Label';
import Checkbox from '../../../components/elements/Checkbox';
import InputGroup from '../../../components/elements/InputGroup';
import FormError from '../../../components/blocks/FormError';
import Button from '../../../components/elements/Button';
import TrashButton from '../../../components/elements/TrashButton';
import Loader from '../../../components/blocks/Loader';
import sortSipGateways from '../../../helpers/sortSipGateways';

const CarriersAddEdit = () => {
  const { voip_carrier_sid } = useParams();
  const type = voip_carrier_sid ? 'edit' : 'add';
  const pageTitle = type === 'edit' ? 'Edit Carrier' : 'Add Carrier';

  const history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');

  // Refs
  const refName = useRef(null);
  const refUsername = useRef(null);
  const refPassword = useRef(null);
  const refRealm = useRef(null);
  const refIp = useRef([]);
  const refPort = useRef([]);
  const refInbound = useRef([]);
  const refOutbound = useRef([]);
  const refTrash = useRef([]);
  const refAdd = useRef(null);

  // Form inputs
  const [ name,            setName            ] = useState('');
  const [ nameInvalid,     setNameInvalid     ] = useState(false);
  const [ description,     setDescription     ] = useState('');
  const [ e164,            setE164            ] = useState(false);
  const [ authenticate,    setAuthenticate    ] = useState(false);
  const [ register,        setRegister        ] = useState(false);
  const [ username,        setUsername        ] = useState('');
  const [ usernameInvalid, setUsernameInvalid ] = useState(false);
  const [ password,        setPassword        ] = useState('');
  const [ passwordInvalid, setPasswordInvalid ] = useState(false);
  const [ realm,           setRealm           ] = useState('');
  const [ realmInvalid,    setRealmInvalid    ] = useState(false);
  const [ sipGateways,     setSipGateways     ] = useState([
    {
      sip_gateway_sid: '',
      ip: '',
      port: 5060,
      inbound: true,
      outbound: true,
      invalidIp: false,
      invalidPort: false,
      invalidInbound: false,
      invalidOutbound: false,
    }
  ]);

  const [ sipRealm,     setSipRealm     ] = useState('');
  const [ carrierSid,   setCarrierSid   ] = useState('');
  const [ showLoader,   setShowLoader   ] = useState(true);
  const [ errorMessage, setErrorMessage ] = useState('');

  useEffect(() => {
    document.title = `${pageTitle} | jambonz`;

    const getAPIData = async () => {
      let isMounted = true;
      try {
        // Get SIP realm via /Users/me
        const usersMePromise = axios({
          method: 'get',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: '/Users/me',
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        const promises = [];
        promises.push(usersMePromise);

        if (type === 'edit') {
          const carrierPromise = axios({
            method: 'get',
            baseURL: process.env.REACT_APP_API_BASE_URL,
            url: `/VoipCarriers/${voip_carrier_sid}`,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });

          const sipGatewaysPromise = axios({
            method: 'get',
            baseURL: process.env.REACT_APP_API_BASE_URL,
            url: `/SipGateways`,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });

          promises.push(carrierPromise);
          promises.push(sipGatewaysPromise);
        }

        const promiseResponses = await Promise.all(promises);

        const usersMe = promiseResponses[0].data;

        if (usersMe.account) {
          setSipRealm(usersMe.account.sip_realm);
        }

        if (type === 'edit') {

          const carrier = promiseResponses[1].data;
          const allSipGateways = promiseResponses[2].data;

          if (!carrier) {
            isMounted = false;
            history.push('/account/carriers');
            dispatch({
              type: 'ADD',
              level: 'error',
              message: 'That carrier does not exist.',
            });
            return;
          }

          const currentSipGateways = allSipGateways.filter(s => {
            return s.voip_carrier_sid === carrier.voip_carrier_sid;
          });

          sortSipGateways(currentSipGateways);

          setName(carrier.name || '');
          setDescription(carrier.description || '');
          setE164(carrier.e164_leading_plus === 1);
          setRegister(carrier.requires_register === 1);
          setUsername(carrier.register_username || '');
          setPassword(carrier.register_password || '');
          setRealm(carrier.register_sip_realm || '');
          setSipGateways(currentSipGateways.map(s => ({
            sip_gateway_sid: s.sip_gateway_sid,
            ip: s.ipv4,
            port: s.port,
            inbound: s.inbound === 1,
            outbound: s.outbound === 1,
            invalidIp: false,
            invalidPort: false,
            invalidInbound: false,
            invalidOutbound: false,
          })));
          setCarrierSid(carrier.voip_carrier_sid);
        }

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
          setErrorMessage('Something went wrong, please try again.');
          dispatch({
            type: 'ADD',
            level: 'error',
            message: (err.response && err.response.data && err.response.data.msg) || 'Unable to get carriers',
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

  const addSipGateway = () => {
    const newSipGateways = [
      ...sipGateways,
      {
        sip_gateway_sid: '',
        ip: '',
        port: 5060,
        inbound: true,
        outbound: true,
        invalidIp: false,
        invalidPort: false,
        invalidInbound: false,
        invalidOutbound: false,
      }
    ];
    setSipGateways(newSipGateways);
  };

  const removeSipGateway = index => {
    const newSipGateways = sipGateways.filter((s,i) => i !== index);
    setSipGateways(newSipGateways);
    setErrorMessage('');
  };

  const updateSipGateways = (e, i, key) => {
    const newSipGateways = [...sipGateways];
    const newValue =
      key === 'invalidIp'       ||
      key === 'invalidPort'     ||
      key === 'invalidInbound'  ||
      key === 'invalidOutbound'
        ? true
        : (key === 'inbound') || (key === 'outbound')
          ? e.target.checked
          : e.target.value;
    newSipGateways[i][key] = newValue;
    setSipGateways(newSipGateways);
  };

  const resetInvalidFields = () => {
    setNameInvalid(false);
    setUsernameInvalid(false);
    setPasswordInvalid(false);
    setRealmInvalid(false);
    const newSipGateways = [...sipGateways];
    newSipGateways.forEach((s, i) => {
      newSipGateways[i].invalidIp = false;
      newSipGateways[i].invalidPort = false;
      newSipGateways[i].invalidInbound = false;
      newSipGateways[i].invalidOutbound = false;
    });
    setSipGateways(newSipGateways);
  };

  const handleSubmit = async e => {
    let isMounted = true;
    try {
      setShowLoader(true);
      e.preventDefault();
      setErrorMessage('');
      resetInvalidFields();
      let errorMessages = [];
      let focusHasBeenSet = false;

      if (!name) {
        errorMessages.push('Please provide a name.');
        setNameInvalid(true);
        if (!focusHasBeenSet) {
          refName.current.focus();
          focusHasBeenSet = true;
        }
      }

      if (!register && ((username && !password) || (!username && password))) {
        errorMessages.push('Username and password must be either both filled out or both empty.');
        setUsernameInvalid(true);
        setPasswordInvalid(true);
        if (!focusHasBeenSet) {
          if (!username) {
            refUsername.current.focus();
          } else {
            refPassword.current.focus();
          }
          focusHasBeenSet = true;
        }
      }

      if (register && !username) {
        errorMessages.push('If registration is required, you must provide a username.');
        setUsernameInvalid(true);
        if (!focusHasBeenSet) {
          refUsername.current.focus();
          focusHasBeenSet = true;
        }
      }

      if (register && !password) {
        errorMessages.push('If registration is required, you must provide a password.');
        setPasswordInvalid(true);
        if (!focusHasBeenSet) {
          refPassword.current.focus();
          focusHasBeenSet = true;
        }
      }

      if (register && !realm) {
        errorMessages.push('If registration is required, you must provide a SIP realm.');
        setRealmInvalid(true);
        if (!focusHasBeenSet) {
          refRealm.current.focus();
          focusHasBeenSet = true;
        }
      }

      if (!sipGateways.length) {
        errorMessages.push('You must provide at least one SIP Gateway.');
        if (!focusHasBeenSet) {
          refAdd.current.focus();
          focusHasBeenSet = true;
        }
      }

      const regIp = /^((25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])$/;
      const regFqdn = /^([a-zA-Z][^.]*)(\.[^.]+){2,}$/;
      const regFqdnTopLevel = /^([a-zA-Z][^.]*)(\.[^.]+)$/;
      const regPort = /^[0-9]+$/;

      sipGateways.forEach(async (gateway, i) => {
        //-----------------------------------------------------------------------------
        // IP validation
        //-----------------------------------------------------------------------------
        const type = regIp.test(gateway.ip.trim())
          ? 'ip'
          : regFqdn.test(gateway.ip.trim())
            ? 'fqdn'
            : regFqdnTopLevel.test(gateway.ip.trim())
              ? 'fqdn-top-level'
              : 'invalid';

        if (!gateway.ip) {
          errorMessages.push('The IP Address cannot be blank. Please provide an IP address or delete the row.');
          updateSipGateways(null, i, 'invalidIp');
          if (!focusHasBeenSet) {
            refIp.current[i].focus();
            focusHasBeenSet = true;
          }
        }

        else if (type === 'fqdn-top-level') {
          errorMessages.push('When using an FQDN, you must use a subdomain (e.g. sip.example.com).');
          updateSipGateways(null, i, 'invalidIp');
          if (!focusHasBeenSet) {
            refIp.current[i].focus();
            focusHasBeenSet = true;
          }
        }

        else if (type === 'invalid') {
          errorMessages.push('Please provide a valid IP address or fully qualified domain name.');
          updateSipGateways(null, i, 'invalidIp');
          if (!focusHasBeenSet) {
            refIp.current[i].focus();
            focusHasBeenSet = true;
          }
        }

        //-----------------------------------------------------------------------------
        // Port validation
        //-----------------------------------------------------------------------------
        if (
          gateway.port && (
            !(regPort.test(gateway.port.toString().trim()))
            || (parseInt(gateway.port.toString().trim()) < 0)
            || (parseInt(gateway.port.toString().trim()) > 65535)
          )
        ) {
          errorMessages.push('Please provide a valid port number between 0 and 65535');
          updateSipGateways(null, i, 'invalidPort');
          if (!focusHasBeenSet) {
            refPort.current[i].focus();
            focusHasBeenSet = true;
          }
        }

        //-----------------------------------------------------------------------------
        // inbound/outbound validation
        //-----------------------------------------------------------------------------
        if (type === 'fqdn' && (!gateway.outbound || gateway.inbound)) {
          errorMessages.push('A fully qualified domain name may only be used for outbound calls.');
          updateSipGateways(null, i, 'invalidIp');
          if (gateway.inbound) updateSipGateways(null, i, 'invalidInbound');
          if (!gateway.outbound) updateSipGateways(null, i, 'invalidOutbound');
          if (!focusHasBeenSet) {
            if (gateway.inbound) {
              refInbound.current[i].focus();
            } else {
              refOutbound.current[i].focus();
            }
            focusHasBeenSet = true;
          }
        }

        else if (!gateway.inbound && !gateway.outbound) {
          errorMessages.push('Each SIP Gateway must accept inbound calls, outbound calls, or both.');
          updateSipGateways(null, i, 'invalidInbound');
          updateSipGateways(null, i, 'invalidOutbound');
          if (!focusHasBeenSet) {
            refInbound.current[i].focus();
            focusHasBeenSet = true;
          }
        }

        //-----------------------------------------------------------------------------
        // duplicates validation
        //-----------------------------------------------------------------------------
        sipGateways.forEach((otherGateway, j) => {
          if (i >= j) return;
          if (!gateway.ip) return;
          if (type === 'invalid') return;
          if (gateway.ip === otherGateway.ip && gateway.port === otherGateway.port) {
            errorMessages.push('Each SIP gateway must have a unique IP address.');
            updateSipGateways(null, i, 'invalidIp');
            updateSipGateways(null, i, 'invalidPort');
            updateSipGateways(null, j, 'invalidIp');
            updateSipGateways(null, j, 'invalidPort');
            if (!focusHasBeenSet) {
              refTrash.current[j].focus();
              focusHasBeenSet = true;
            }
          }
        });
      });

      // remove duplicate error messages
      for (let i = 0; i < errorMessages.length; i++) {
        for (let j = 0; j < errorMessages.length; j++) {
          if (i >= j) continue;
          if (errorMessages[i] === errorMessages[j]) {
            errorMessages.splice(j, 1);
            j = j - 1;
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

      //=============================================================================
      // Submit
      //=============================================================================
      const creatingNewCarrier = type === 'add';

      const method = creatingNewCarrier
        ? 'post'
        : 'put';

      const url = creatingNewCarrier
        ? '/VoipCarriers'
        : `/VoipCarriers/${carrierSid}`;

      // Create or update carrier
      const voipCarrier = await axios({
        method,
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data: {
          name: name.trim() || null,
          description: description.trim() || null,
          e164_leading_plus: e164 ? 1 : 0,
          requires_register: register ? 1 : 0,
          register_username: register ? username.trim() : null,
          register_password: register ? password : null,
          register_sip_realm: register ? realm.trim() : null,
        },
      });
      const voip_carrier_sid = voipCarrier.data.sid;

      // get updated gateway info from API in order to delete ones that user has removed from UI
      let sipGatewaysFromAPI;
      if (!creatingNewCarrier) {
        const results = await axios({
          method: 'get',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: '/SipGateways',
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        sipGatewaysFromAPI = results.data.filter(s => s.voip_carrier_sid === carrierSid);
      }

      //-----------------------------------------------------------------------------
      // Create or Update SIP Gateways
      //-----------------------------------------------------------------------------
      // Keeping track of created SIP gateways in case one throws an error, then all
      // of the ones created before that (as well as the carrier) have to be deleted.
      let completedSipGateways = [];
      try {
        for (const s of sipGateways) {
          const creatingNewGateway = creatingNewCarrier || s.sip_gateway_sid === '';

          const method = creatingNewGateway
            ? 'post'
            : 'put';

          const url = creatingNewGateway
            ? '/SipGateways'
            : `/SipGateways/${s.sip_gateway_sid}`;

          const data = {
            ipv4: s.ip.trim(),
            port: s.port.toString().trim(),
            inbound: s.inbound,
            outbound: s.outbound,
          };

          if (creatingNewGateway) {
            data.voip_carrier_sid = voip_carrier_sid || carrierSid;
          }

          const result = await axios({
            method,
            baseURL: process.env.REACT_APP_API_BASE_URL,
            url,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
            data,
          });
          if (creatingNewGateway) {
            completedSipGateways.push(result.data.sid);
          }
        };
      } catch (err) {
        if (completedSipGateways.length) {
          for (const sid of completedSipGateways) {
            await axios({
              method: 'delete',
              baseURL: process.env.REACT_APP_API_BASE_URL,
              url: `/SipGateways/${sid}`,
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            });
          }
        }
        if (voip_carrier_sid) {
          await axios({
            method: 'delete',
            baseURL: process.env.REACT_APP_API_BASE_URL,
            url: `/VoipCarriers/${voip_carrier_sid}`,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
        }
        throw err;
      }

      // delete removed gateways (after add/update in case add/update caused errors)
      if (!creatingNewCarrier) {
        for (const remote of sipGatewaysFromAPI) {
          const match = sipGateways.filter(local => local.sip_gateway_sid === remote.sip_gateway_sid);
          if (!match.length) {
            await axios({
              method: 'delete',
              baseURL: process.env.REACT_APP_API_BASE_URL,
              url: `/SipGateways/${remote.sip_gateway_sid}`,
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            });
          }
        }
      }

      isMounted = false;
      history.push('/account/carriers');
      const dispatchMessage = type === 'add'
        ? 'Carrier created successfully'
        : 'Carrier updated successfully';
      dispatch({
        type: 'ADD',
        level: 'success',
        message: dispatchMessage
      });

    } catch(err) {
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
      subtitle={sipRealm ? `Have your carrier send calls to ${sipRealm}` : <>&nbsp;</>}
      breadcrumbs={[
        { name: 'Back to Carriers', url: '/account/carriers' },
      ]}
    >
      {showLoader ? (
        <Loader height="376px" />
      ) : (
        <Form
          large
          onSubmit={handleSubmit}
        >
          <Label htmlFor="name">Name</Label>
          <Input
            name="name"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Carrier name"
            invalid={nameInvalid}
            autoFocus
            ref={refName}
          />

          <Label htmlFor="description">Description</Label>
          <Input
            name="description"
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Optional"
          />

          <Label htmlFor="e164">E.164 Syntax</Label>
          <Checkbox
            noLeftMargin
            name="e164"
            id="e164"
            label="prepend a leading + on origination attempts"
            checked={e164}
            onChange={e => setE164(e.target.checked)}
          />

          <hr style={{ margin: '0.5rem -2rem' }} />

          {
            !authenticate ? (
              <React.Fragment>
                <div></div>
                <Button
                  text
                  formLink
                  type="button"
                  onClick={e => setAuthenticate(!authenticate)}
                >
                  Does your carrier require authentication?
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Label htmlFor="username">Username</Label>
                <Input
                  name="username"
                  id="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="SIP username for authentication"
                  invalid={usernameInvalid}
                  ref={refUsername}
                />
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  allowShowPassword
                  name="password"
                  id="password"
                  password={password}
                  setPassword={setPassword}
                  setErrorMessage={setErrorMessage}
                  placeholder="SIP password for authentication"
                  invalid={passwordInvalid}
                  ref={refPassword}
                />
                <div></div>
                <Checkbox
                  noLeftMargin
                  name="register"
                  id="register"
                  label="Requires registration"
                  checked={register}
                  onChange={e => setRegister(e.target.checked)}
                />
                {
                  register ? (
                    <React.Fragment>
                      <Label htmlFor="realm">SIP Realm</Label>
                      <Input
                        name="realm"
                        id="realm"
                        value={realm}
                        onChange={e => setRealm(e.target.value)}
                        placeholder="SIP realm for registration"
                        invalid={realmInvalid}
                        ref={refRealm}
                      />
                    </React.Fragment>
                  ) : (
                    null
                  )
                }
              </React.Fragment>
            )
          }

          <hr style={{ margin: '0.5rem -2rem' }} />

          <div
            style={{ whiteSpace: 'nowrap' }}
          >SIP Gateways</div>
          {
            sipGateways.length
            ? <div>{/* for CSS grid layout */}</div>
            : null
          }
          {sipGateways.map((g, i) => (
            <React.Fragment key={i}>
              <Label htmlFor={`sipGatewaysIp[${i}]`}>IP Address</Label>
              <InputGroup>
                <Input
                  name={`sipGatewaysIp[${i}]`}
                  id={`sipGatewaysIp[${i}]`}
                  value={sipGateways[i].ip}
                  onChange={e => updateSipGateways(e, i, 'ip')}
                  placeholder={'1.2.3.4'}
                  invalid={sipGateways[i].invalidIp}
                  ref={ref => refIp.current[i] = ref}
                />
                <Label
                  middle
                  htmlFor={`sipGatewaysPort[${i}]`}
                >
                  Port
                </Label>
                <Input
                  width="5rem"
                  name={`sipGatewaysPort[${i}]`}
                  id={`sipGatewaysPort[${i}]`}
                  value={sipGateways[i].port}
                  onChange={e => updateSipGateways(e, i, 'port')}
                  placeholder="5060"
                  invalid={sipGateways[i].invalidPort}
                  ref={ref => refPort.current[i] = ref}
                />
                <Checkbox
                  id={`inbound[${i}]`}
                  label="Inbound"
                  tooltip="Sends us calls"
                  checked={sipGateways[i].inbound}
                  onChange={e => updateSipGateways(e, i, 'inbound')}
                  invalid={sipGateways[i].invalidInbound}
                  ref={ref => refInbound.current[i] = ref}
                />
                <Checkbox
                  id={`outbound[${i}]`}
                  label="Outbound"
                  tooltip="Accepts calls from us"
                  checked={sipGateways[i].outbound}
                  onChange={e => updateSipGateways(e, i, 'outbound')}
                  invalid={sipGateways[i].invalidOutbound}
                  ref={ref => refOutbound.current[i] = ref}
                />
                <TrashButton
                  onClick={() => removeSipGateway(i)}
                  ref={ref => refTrash.current[i] = ref}
                />
              </InputGroup>
            </React.Fragment>
          ))}
          <Button
            square
            type="button"
            onClick={addSipGateway}
            ref={refAdd}
          >
            +
          </Button>
          {errorMessage && (
            <FormError grid message={errorMessage} />
          )}

          <InputGroup flexEnd spaced>
            <Button
              grid
              gray
              type="button"
              onClick={() => {
                history.push('/account/carriers');
                dispatch({
                  type: 'ADD',
                  level: 'info',
                  message: 'Changes canceled',
                });
              }}
            >
              Cancel
            </Button>

            <Button grid>
              {type === 'add'
                ? 'Add Carrier'
                : 'Save'
              }
            </Button>
          </InputGroup>
        </Form>
      )}
    </InternalTemplate>
  );
};

export default CarriersAddEdit;
