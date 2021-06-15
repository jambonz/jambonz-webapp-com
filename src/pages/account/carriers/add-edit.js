import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import styled from "styled-components/macro";
import { Menu, Dropdown, Tabs, Switch } from "antd";

import { NotificationDispatchContext } from '../../../contexts/NotificationContext';
import InternalMain from '../../../components/wrappers/InternalMain';
import Section from '../../../components/blocks/Section';
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
import Select from '../../../components/elements/Select';
import { ResponsiveContext } from "../../../contexts/ResponsiveContext";
import handleErrors from "../../../helpers/handleErrors";

const { TabPane } = Tabs;

const StyledSection = styled.fieldset`
  margin: auto;
  width: calc(100% - 0.5rem);
  margin-bottom: 1.5rem;
  padding: 2rem;
  border-radius: 0.5rem;
  background: #FFF;
  border:1px solid rgb(0 0 0 / 10%);
  
  > *:first-child {
    margin-top: 0;
  }

  > *:last-child {
    margin-bottom: 0;
  }
`;

const StyledForm = styled(Form)`
  @media (max-width: 978.98px) {
    flex-direction: column;
    display: flex;
    align-items: flex-start;

    & > * {
      width: 100%;
    }

    & > hr {
      width: calc(100% + 4rem);
    }
  }
  
  ${props => props.theme.mobileOnly} {
    & > hr {
      margin: 0.5rem -1rem !important;
      width: calc(100% + 2rem);
    }
  }
`;

const StyledFormError = styled(FormError)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem
`;

const StyledLabel = styled(Label)`
  grid-column: 1 / 3;
`;

const StyledButton = styled(Button)`
  grid-column: 1 / 3;
`;

const SIPGatewaysInputGroup = styled(InputGroup)`
  grid-column: 1 / 3;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 1fr 80px 80px auto;

  @media (max-width: 978.98px) {
    grid-template-columns: 1fr 80px 80px auto;
  }

  @media (max-width: 899.98px) {
    grid-template-columns: 1fr 100px 80px;
  }

  @media (max-width: 767.98px) {
    grid-template-columns: 1fr 80px 80px auto;
  }

  @media (max-width: 549.98px) {
    grid-template-columns: 1fr 100px 80px;
  }
`;

const SMPPGatewaysInboundInputGroup = styled(InputGroup)`
  grid-column: 2 / 3;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 1fr 80px 50px 70px;
`;

const SMPPGatewaysOutboundInputGroup = styled(InputGroup)`
  grid-column: 2 / 3;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 1fr 80px 50px 20px 50px;
`;

const SIPGatewaysChecboxGroup = styled.div`
  display: flex;
  @media (max-width: 978.98px) {
    & > *:first-child {
      margin-left: -0.5rem;
    }
  }

  @media (max-width: 549.98px) {
    grid-column: 1 / 3;
  }
`;

const StyledButtonGroup = styled(InputGroup)`
  @media (max-width: 576.98px) {
    width: 100%;

    & > * {
      width: 100%;

      & > * {
        width: 100%;
      }
    }
  }

  @media (max-width: 399.98px) {
    flex-direction: column;

    & > *:first-child {
      margin-right: 0;
      margin-bottom: 1rem;
    }
  }
`;

const NameFieldWrapper = styled.div`
  ${(props) => props.hasDropdown ? `
    display: grid;
    grid-template-columns: 75%  25%;
    align-items: center;
  ` : `
    width: 100%;
  `}
`;

const CarrierSelect = styled.div`
  margin-left: 1rem;

  & > * {
    width: 100%;
    justify-content: flex-end;
  }
`;

const CarrierItem = styled.div`
  font-family: Objectivity;
  font-size: 16px;
  font-weight: 400;
  color: #565656;
  padding: 0.25rem 0.5rem;

  ${(props) => props.disabled ? 'opacity: 0.5;' : ''}
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #231f20;
  white-space: pre;
`;

const StyledLegend = styled.legend`
  font-size: 16px;
  color: #231f20;
  padding: 0 0.5rem;
  width: fit-content;
`;

const CarriersAddEdit = ({ mode }) => {
  const { width } = useContext(ResponsiveContext);
  const { voip_carrier_sid } = useParams();
  const type = voip_carrier_sid ? 'edit' : 'add';
  const pageTitle = type === 'edit' ? 'Edit Carrier' : 'Add Carrier';

  const history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');
  const accountSid = localStorage.getItem('account_sid');

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
  const refTechPrefix = useRef(null);

  const refSmppSystemId = useRef(null);
  const refSmppPassword = useRef(null);
  const refSmppInboundSystemId = useRef(null);
  const refSmppInboundPassword = useRef(null);
  const refSmppIp = useRef([]);
  const refSmppPort = useRef([]);
  const refSmppTrash = useRef([]);

  // Form inputs
  const [ name,            setName            ] = useState('');
  const [ nameInvalid,     setNameInvalid     ] = useState(false);
  const [ e164,            setE164            ] = useState(false);
  const [ application,      setApplication    ] = useState('');
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
      voip_carrier_sid: '',
      inbound: true,
      outbound: false,
      invalidIp: false,
      invalidPort: false,
      invalidInbound: false,
      invalidOutbound: false,
    }
  ]);
  const [ smpp_system_id,        setSmppSystemId        ] = useState('');
  const [ smpp_system_idInvalid, setSmppSystemIdInvalid ] = useState(false);
  const [ smpp_password,        setSmppPassword        ] = useState('');
  const [ smpp_passwordInvalid, setSmppPasswordInvalid ] = useState(false);
  const [ smpp_inbound_system_id,        setSmppInboundSystemId        ] = useState('');
  const [ smpp_inbound_password,        setSmppInboundPassword        ] = useState('');
  const [ smpp_inbound_passwordInvalid, setSmppInboundPasswordInvalid ] = useState(false);

  const [ smppGateways,     setSmppGateways     ] = useState([
    {
      smpp_gateway_sid: '',
      ipv4: '',
      port: 2775,
      voip_carrier_sid: '',
      inbound: false,
      use_tls: 0,
      outbound: true,
      is_primary: 1,
      invalidIp: false,
      invalidPort: false,
    },
    {
      smpp_gateway_sid: '',
      ipv4: '',
      port: 2775,
      voip_carrier_sid: '',
      inbound: true,
      use_tls: 0,
      outbound: false,
      is_primary: 0,
      invalidIp: false,
      invalidPort: false,
    }
  ]);

  const [ applicationValues, setApplicationValues ] = useState([]);

  const [ sipRealm,     setSipRealm     ] = useState('');
  const [ carrierSid,   setCarrierSid   ] = useState('');
  const [ showLoader,   setShowLoader   ] = useState(true);
  const [ errorMessage, setErrorMessage ] = useState('');

  const [requiredTechPrefix, setRequiredTechPrefix] = useState(false);
  const [techPrefix, setTechPrefix] = useState('');
  const [techPrefixInvalid, setTechPrefixInvalid ] = useState(false);
  const [suportSIP, setSupportSIP] = useState(false);
  const [diversion, setDiversion] = useState("");
  const [carrierActive, setCarrierActive] = useState(true);

  const [predefinedCarriers, setPredefinedCarriers] = useState([]);
  const [staticIPs, setStaticIPs] = useState(null);
  const [ sbcs, setSbcs ] = useState('');

  const [smpps, setSmpps] = useState([]);
  const [smppSubTitleForInbound, setSmppSubTitleForInbound] = useState('');
  const [smppSubTitleForOutbound, setSmppSubTitleForOutbound] = useState('');
  const [activeTab, setActiveTab] = useState('1');
  useEffect(() => {
    const getAPIData = async () => {
      let isMounted = true;
      try {
        const sbcResults = await axios({
          method: 'get',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: `/Sbcs`,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        setSbcs(sbcResults.data);
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

        // Get Application Data
        const applicationPromise = axios({
          method: 'get',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: '/Applications',
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        promises.push(applicationPromise);

        const smppsPromise = axios({
          method: 'get',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: '/Smpps',
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        promises.push(smppsPromise);

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
            url: `/SipGateways?voip_carrier_sid=${voip_carrier_sid}`,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });

          const smppGatewaysPromise = axios({
            method: 'get',
            baseURL: process.env.REACT_APP_API_BASE_URL,
            url: `/SmppGateways?voip_carrier_sid=${voip_carrier_sid}`,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });

          promises.push(carrierPromise);
          promises.push(sipGatewaysPromise);
          promises.push(smppGatewaysPromise);
        }

        const promiseResponses = await Promise.all(promises);

        const usersMe = promiseResponses[0].data;
        setApplicationValues(promiseResponses[1].data);
        setSmpps(promiseResponses[2].data);
        getSmppSubTitle(promiseResponses[2].data);

        if (usersMe.account) {
          setSipRealm(usersMe.account.sip_realm);
          setStaticIPs(usersMe.account.static_ips || null);
          // Explicitly set inbound system ID to SIP realm subdomain
          // E.g. For 'daveh.sip.jambonz.us' it would need to set it to 'daveh'
          setSmppInboundSystemId(usersMe.account.sip_realm.split('.').shift());
        }

        if (type === 'edit') {

          const carrier = promiseResponses[3].data;
          const allSipGateways = promiseResponses[4].data;
          const allSmppGateways = promiseResponses[5].data;

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

          const currentSmppGateways = allSmppGateways.filter(s => {
            return s.voip_carrier_sid === carrier.voip_carrier_sid;
          });

          sortSipGateways(currentSipGateways);
          sortSipGateways(currentSmppGateways);

          setName(carrier.name || '');
          setE164(carrier.e164_leading_plus === 1);
          setApplication(carrier.application_sid || '');
          setAuthenticate(carrier.register_username ? true : false);
          setRegister(carrier.requires_register === 1);
          setUsername(carrier.register_username || '');
          setPassword(carrier.register_password || '');
          setRealm(carrier.register_sip_realm || '');
          setSipGateways(currentSipGateways.map(s => ({
            sip_gateway_sid: s.sip_gateway_sid,
            ip: s.ipv4,
            port: s.port,
            netmask: s.netmask,
            voip_carrier_sid: s.voip_carrier_sid,
            inbound: s.inbound === 1,
            outbound: s.outbound === 1,
            invalidIp: false,
            invalidPort: false,
            invalidInbound: false,
            invalidOutbound: false,
          })));
          setSmppSystemId(carrier.smpp_system_id || '');
          setSmppPassword(carrier.smpp_password || '');
          setSmppInboundPassword(carrier.smpp_inbound_password || '');
          setSmppGateways(currentSmppGateways.map(s => ({
            smpp_gateway_sid: s.smpp_gateway_sid,
            ipv4: s.ipv4,
            port: s.port,
            netmask: s.netmask,
            voip_carrier_sid: s.voip_carrier_sid,
            inbound: s.inbound,
            outbound: s.outbound,
            use_tls: s.use_tls,
            is_primary: s.is_primary,
            invalidIp: false,
            invalidPort: false,
          })));
          setCarrierSid(carrier.voip_carrier_sid);
          setTechPrefix(carrier.tech_prefix || '');
          setRequiredTechPrefix(carrier.tech_prefix ? true : false);
          setSupportSIP(carrier.diversion ? true : false);
          setDiversion(carrier.diversion || '');
          setCarrierActive(carrier.is_active === 1);
        } else {
          const result = await axios({
            method: 'get',
            baseURL: process.env.REACT_APP_API_BASE_URL,
            url: `/PredefinedCarriers`,
          });
          setPredefinedCarriers(
            result.data
              .map((item) => ({
                ...item,
                value: item.predefined_carrier_sid,
                text: item.requires_static_ip
                  ? `${item.name} - requires static IP`
                  : item.name,
              }))
              .sort((a, b) => a.text.localeCompare(b.text))
          );
        }

      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.clear();
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
  }, [mode]);

  const addSipGateway = () => {
    const newSipGateways = [
      ...sipGateways,
      {
        sip_gateway_sid: '',
        ip: '',
        port: 5060,
        inbound: true,
        outbound: false,
        voip_carrier_sid: '',
        invalidIp: false,
        invalidPort: false,
        invalidInbound: false,
        invalidOutbound: false,
      }
    ];
    setSipGateways(newSipGateways);
  };

  const addSmppGateway = (inbound) => {
    const newSmppGateways = [
      ...smppGateways,
      {
        smpp_gateway_sid: '',
        ipv4: '',
        port: 2775,
        inbound: inbound,
        outbound: !inbound,
        voip_carrier_sid: '',
        use_tls: 0,
        is_primary: 0,
        invalidIp: false,
        invalidPort: false,
      }
    ];
    setSmppGateways(newSmppGateways);
  };

  const removeSipGateway = index => {
    const newSipGateways = sipGateways.filter((s,i) => i !== index);
    setSipGateways(newSipGateways);
    setErrorMessage('');
  };

  const removeSmppGateway = index => {
    const newSmppGateways = smppGateways.filter((s,i) => i !== index);
    setSmppGateways(newSmppGateways);
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

    if (key === "outbound" && newValue === true) {
      newSipGateways[i]["netmask"] = 32;
    }
    setSipGateways(newSipGateways);
  };

  const updateSmppGateways = (e, i, key) => {
    const newSmppGateways = [...smppGateways];
    const newValue =
      key === 'invalidIp'       ||
      key === 'invalidPort'
        ? true
        : (key === 'use_tls') || (key === 'is_primary')
          ? e?1:0
          : e.target.value;
    newSmppGateways[i][key] = newValue;

    if (key === "outbound" && newValue === true) {
      newSmppGateways[i]["netmask"] = 32;
    }

    setSmppGateways(newSmppGateways);
  };

  const resetInvalidFields = () => {
    setNameInvalid(false);
    setUsernameInvalid(false);
    setPasswordInvalid(false);
    setRealmInvalid(false);
    setTechPrefixInvalid(false);
    const newSipGateways = [...sipGateways];
    newSipGateways.forEach((s, i) => {
      s.invalidIp = false;
      s.invalidPort = false;
      s.invalidInbound = false;
      s.invalidOutbound = false;
    });
    setSipGateways(newSipGateways);
    setSmppSystemIdInvalid(false);
    setSmppPasswordInvalid(false);
    setSmppInboundPasswordInvalid(false);
    const newSmppGateways = [...smppGateways];
    newSmppGateways.forEach((s, i) => {
      s.invalidIp = false;
      s.invalidPort = false;
    });
    setSmppGateways(newSmppGateways);
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
      const regIp = /^((25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])$/;
      const regFqdn = /^([a-zA-Z][^.]*)(\.[^.]+){2,}$/;
      const regFqdnTopLevel = /^([a-zA-Z][^.]*)(\.[^.]+)$/;
      const regPort = /^[0-9]+$/;

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
          setActiveTab('1');
          focusHasBeenSet = true;
        }
      }

      if (register && !username) {
        errorMessages.push('If registration is required, you must provide a username.');
        setUsernameInvalid(true);
        if (!focusHasBeenSet) {
          refUsername.current.focus();
          setActiveTab('1');
          focusHasBeenSet = true;
        }
      }

      if (register && !password) {
        errorMessages.push('If registration is required, you must provide a password.');
        setPasswordInvalid(true);
        if (!focusHasBeenSet) {
          refPassword.current.focus();
          setActiveTab('1');
          focusHasBeenSet = true;
        }
      }

      if (register && !realm) {
        errorMessages.push('If registration is required, you must provide a SIP realm.');
        setRealmInvalid(true);
        if (!focusHasBeenSet) {
          refRealm.current.focus();
          setActiveTab('1');
          focusHasBeenSet = true;
        }
      }

      if (techPrefix && techPrefix.length < 2) {
        errorMessages.push('If registration is required, you must provide a Tech prefix with more than 2 characters.');
        setTechPrefixInvalid(true);
        if (!focusHasBeenSet) {
          refTechPrefix.current.focus();
          setActiveTab('1');
          focusHasBeenSet = true;
        }
      }

      if (!sipGateways.length) {
        errorMessages.push('You must provide at least one SIP Gateway.');
        if (!focusHasBeenSet) {
          refAdd.current.focus();
          setActiveTab('1');
          focusHasBeenSet = true;
        }
      }

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
          errorMessages.push('The SIP Gateway IP Address cannot be blank. Please provide an IP address or delete the row.');
          updateSipGateways(null, i, 'invalidIp');
          if (!focusHasBeenSet) {
            refIp.current[i].focus();
            setActiveTab('1');
            focusHasBeenSet = true;
          }
        }

        else if (type === 'fqdn-top-level') {
          errorMessages.push('When using an FQDN, you must use a subdomain (e.g. sip.example.com).');
          updateSipGateways(null, i, 'invalidIp');
          if (!focusHasBeenSet) {
            refIp.current[i].focus();
            setActiveTab('1');
            focusHasBeenSet = true;
          }
        }

        else if (type === 'invalid') {
          errorMessages.push('Please provide a valid SIP Gateway IP address or fully qualified domain name.');
          updateSipGateways(null, i, 'invalidIp');
          if (!focusHasBeenSet) {
            refIp.current[i].focus();
            setActiveTab('1');
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
            setActiveTab('1');
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
            setActiveTab('1');
            focusHasBeenSet = true;
          }
        }

        else if (!gateway.inbound && !gateway.outbound) {
          errorMessages.push('Each SIP Gateway must accept inbound calls, outbound calls, or both.');
          updateSipGateways(null, i, 'invalidInbound');
          updateSipGateways(null, i, 'invalidOutbound');
          if (!focusHasBeenSet) {
            refInbound.current[i].focus();
            setActiveTab('1');
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
              setActiveTab('1');
              focusHasBeenSet = true;
            }
          }
        });
      });

      // These validations need to execute for SMS tab
      if (smpp_system_id || smpp_password || smpp_inbound_password) {
        if (!smpp_system_id) {
          errorMessages.push('You must provide Outbound System ID.');
          setSmppSystemIdInvalid(true);
          if (!focusHasBeenSet) {
            refSmppSystemId.current.focus();
            setActiveTab('2');
            focusHasBeenSet = true;
          }
        }

        if (!smpp_password) {
          errorMessages.push('You must provide Outbound System Password.');
          setSmppPasswordInvalid(true);
          if (!focusHasBeenSet) {
            refSmppPassword.current.focus();
            setActiveTab('2');
            focusHasBeenSet = true;
          }
        }

        if(smpps && smpps.length > 0) {
          const smppInboundGateways = smppGateways.filter((g) => g.inbound);
          const smppOutboundGateways = smppGateways.filter((g) => g.outbound);

          // Validate Outbound Gateways -- At least one is required
          if (!smppOutboundGateways.length) {
            errorMessages.push('You must provide at least one Outbound Gateway.');
            addSmppGateway(false); // False means NOT inbound, so YES it is outbound
            setActiveTab('2'); // SMPP tab
          }

          // Validate Inbound Gateways -- Password required ONLY if adding Gateway(s)
          if (smppInboundGateways.length) {
            if (!smpp_inbound_password) {
              errorMessages.push('You must provide an Inbound System Password when adding IP Address(es) to whitelist.');
              setSmppInboundPasswordInvalid(true);
              if (!focusHasBeenSet) {
                refSmppInboundPassword.current.focus();
                setActiveTab('2');
                focusHasBeenSet = true;
              }
            }
          }

          smppGateways.forEach(async (gateway, i) => {
            //-----------------------------------------------------------------------------
            // IP validation
            //-----------------------------------------------------------------------------
            const type = regIp.test(gateway.ipv4.trim())
            ? 'ip'
            : regFqdn.test(gateway.ipv4.trim())
              ? 'fqdn'
              : regFqdnTopLevel.test(gateway.ipv4.trim())
                ? 'fqdn-top-level'
                : 'invalid';
            const gatewayTypeText = gateway.outbound ? 'Outbound' : 'Inbound';
            if (!gateway.ipv4) {
              errorMessages.push(`The ${gatewayTypeText} IP Address cannot be blank. Please provide an IP address or delete the row.`);
              updateSmppGateways(null, i, 'invalidIp');
              if (!focusHasBeenSet) {
                refSmppIp.current[i].focus();
                setActiveTab('2');
                focusHasBeenSet = true;
              }
            }

            else if (type === 'fqdn-top-level') {
              errorMessages.push('When using an FQDN, you must use a subdomain (e.g. smpp.example.com).');
              updateSipGateways(null, i, 'invalidIp');
              if (!focusHasBeenSet) {
                refSmppIp.current[i].focus();
                setActiveTab('2');
                focusHasBeenSet = true;
              }
            }

            else if (type === 'invalid') {
              errorMessages.push(`Please provide a valid ${gatewayTypeText} IP address or fully qualified domain name.`);
              updateSmppGateways(null, i, 'invalidIp');
              if (!focusHasBeenSet) {
                refSmppIp.current[i].focus();
                setActiveTab('2');
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
              errorMessages.push(`Please provide a valid ${gatewayTypeText} port number between 0 and 65535`);
              updateSmppGateways(null, i, 'invalidPort');
              if (!focusHasBeenSet) {
                refSmppPort.current[i].focus();
                setActiveTab('2');
                focusHasBeenSet = true;
              }
            }

            //-----------------------------------------------------------------------------
            // inbound/outbound validation
            //-----------------------------------------------------------------------------
            if (type === 'fqdn' && (!gateway.outbound || gateway.inbound)) {
              errorMessages.push('A fully qualified domain name may only be used for outbound calls.');
              updateSmppGateways(null, i, 'invalidIp');
              if (!focusHasBeenSet) {
                refSmppIp.current[i].focus();
                setActiveTab('2');
                focusHasBeenSet = true;
              }
            }

            //-----------------------------------------------------------------------------
            // duplicates validation
            //-----------------------------------------------------------------------------
            smppGateways.forEach((otherGateway, j) => {
              if (i >= j) return;
              if (!gateway.ip) return;
              if (type === 'invalid') return;
              if (gateway.ip === otherGateway.ip && gateway.port === otherGateway.port) {
                errorMessages.push('Each SMPP gateway must have a unique IP address.');
                updateSmppGateways(null, i, 'invalidIp');
                updateSmppGateways(null, i, 'invalidPort');
                updateSmppGateways(null, j, 'invalidIp');
                updateSmppGateways(null, j, 'invalidPort');
                if (!focusHasBeenSet) {
                  refSmppTrash.current[j].focus();
                  setActiveTab('2');
                  focusHasBeenSet = true;
                }
              }
            });
          });
        }
      }
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
          e164_leading_plus: e164 ? 1 : 0,
          application_sid: application || null,
          requires_register: register ? 1 : 0,
          register_username: username ? username.trim() : null,
          register_password: password ? password : null,
          register_sip_realm: register ? realm.trim() : null,
          tech_prefix: techPrefix ? techPrefix.trim() : null,
          diversion: diversion ? diversion.trim() : null,
          is_active: carrierActive ? 1 : 0,
          smpp_system_id: smpp_system_id ? smpp_system_id.trim(): null,
          smpp_password: smpp_password ? smpp_password.trim(): null,
          smpp_inbound_system_id: smpp_inbound_system_id ? smpp_inbound_system_id.trim(): null,
          smpp_inbound_password: smpp_inbound_password ? smpp_inbound_password.trim(): null
        },
      });
      const voip_carrier_sid = voipCarrier.data.sid;

      // get updated gateway info from API in order to delete ones that user has removed from UI
      let sipGatewaysFromAPI;
      let smppGatewaysFromAPI;
      if (!creatingNewCarrier) {
        let results = await axios({
          method: 'get',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: `/SipGateways?voip_carrier_sid=${voip_carrier_sid}`,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        sipGatewaysFromAPI = results.data.filter(s => s.voip_carrier_sid === carrierSid);
        if(smpps && smpps.length > 0) {
          results = await axios({
            method: 'get',
            baseURL: process.env.REACT_APP_API_BASE_URL,
            url: `/SmppGateways?voip_carrier_sid=${voip_carrier_sid}`,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
          smppGatewaysFromAPI = results.data.filter(s => s.voip_carrier_sid === carrierSid);
        }
      }

      //-----------------------------------------------------------------------------
      // Create or Update SIP Gateways
      //-----------------------------------------------------------------------------
      // Keeping track of created SIP gateways in case one throws an error, then all
      // of the ones created before that (as well as the carrier) have to be deleted.
      let completedSipGateways = [];
      let completedSmppGateways = [];
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
            netmask: s.netmask,
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
        if(smpps && smpps.length > 0) {
          for (const s of smppGateways) {
            const creatingNewGateway = creatingNewCarrier || s.smpp_gateway_sid === '';

            const method = creatingNewGateway
              ? 'post'
              : 'put';

            const url = creatingNewGateway
              ? '/SmppGateways'
              : `/SmppGateways/${s.smpp_gateway_sid}`;

            const data = {
              ipv4: s.ipv4.trim(),
              port: s.port.toString().trim(),
              netmask: s.netmask,
              inbound: s.inbound,
              outbound: s.outbound,
              use_tls: s.use_tls,
              is_primary: s.is_primary
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
              completedSmppGateways.push(result.data.sid);
            }
          }
        }
      } catch (err) {
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
        if(smpps && smpps.length > 0) {
          for (const sid of completedSmppGateways) {
            await axios({
              method: 'delete',
              baseURL: process.env.REACT_APP_API_BASE_URL,
              url: `/SmppGateways/${sid}`,
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
        if(smpps && smpps.length > 0) {
          for (const remote of smppGatewaysFromAPI) {
            const match = smppGateways.filter(local => local.smpp_gateway_sid === remote.smpp_gateway_sid);
            if (!match.length) {
              await axios({
                method: 'delete',
                baseURL: process.env.REACT_APP_API_BASE_URL,
                url: `/SmppGateways/${remote.smpp_gateway_sid}`,
                headers: {
                  Authorization: `Bearer ${jwt}`,
                },
              });
            }
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

    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.clear();
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

  const pickupCarrier = async (value) => {
    let isMounted = true;
    try {
      setShowLoader(true);
      setErrorMessage("");

      const result = await axios({
        method: 'post',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Accounts/${accountSid}/PredefinedCarriers/${value}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const { sid } = result.data;

      history.push(`/account/carriers/${sid}/edit`);
    } catch (err) {
      handleErrors({ err, history, dispatch, setErrorMessage });
    } finally {
      if (isMounted) {
        setShowLoader(false);
      }
    }
  };

  const getSmppSubTitle = (smpps) => {
    let titleForInbound = 'Have your carrier send SMPP to ';
    let titleForOutbound = 'If necessary, have you carrier whitelist these IP(s): ';
    if(smpps && smpps.length){
      for(let i = 0; i < smpps.length; i++) {
        if(smpps[i].use_tls === 1){
          titleForInbound += `${smpps[i].ipv4}:${smpps[i].port}(tls), `;
        }
        else {
          titleForInbound += `${smpps[i].ipv4}:${smpps[i].port}, `;
        }
        titleForOutbound += `${smpps[i].ipv4}, `;
      }
      if(titleForInbound.indexOf(', ') > -1) titleForInbound = titleForInbound.slice(0, -2);
      if(titleForOutbound.indexOf(', ') > 15) titleForOutbound = titleForOutbound.slice(0, -2);
    }
    setSmppSubTitleForInbound(titleForInbound);
    setSmppSubTitleForOutbound(titleForOutbound);
  };

  const getSubTitle = () => {
    let title = <>&nbsp;</>;
    let ips = [];
    if(sbcs)sbcs.map(sbc => ips.push(sbc.ipv4));
    if (sipRealm) {
      title = staticIPs
        ? `Have your carrier send your calls to your static IP(s): ${staticIPs.join(
            ", "
          )}`
        : `Have your carrier send calls to ${sipRealm}\nIf necessary, have your carrier whitelist these IP: ${ips.join(", ")}`;
    }
    return title;
  };
  const onChangeTab = activeKey => {
    setActiveTab(activeKey);
  };
  return (
    <InternalMain
      type="form"
      title={pageTitle}
      subtitle={getSubTitle()}
      breadcrumbs={[
        { name: 'Back to Carriers', url: '/account/carriers' },
      ]}
    >
      <Section>
        {showLoader ? (
          <Loader height="376px" />
        ) : (
          <>
            <StyledForm large>
              <Label htmlFor="name">Name</Label>
              <NameFieldWrapper hasDropdown={type === 'add'}>
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
                {type === 'add' && (
                  <CarrierSelect>
                    <Dropdown
                      placement="bottomRight"
                      trigger="click"
                      overlay={
                        <Menu>
                          {predefinedCarriers.map((item) => {
                            const disabled = !staticIPs && item.requires_static_ip;
                            return (
                              <Menu.Item key={item.value} disabled={disabled}>
                                <CarrierItem
                                  disabled={disabled}
                                  onClick={() => !disabled && pickupCarrier(item.value)}
                                >
                                  {item.text}
                                </CarrierItem>
                              </Menu.Item>
                            );
                          })}
                        </Menu>
                      }
                    >
                      <Button text formLink type="button">
                        Select from list
                      </Button>
                    </Dropdown>
                  </CarrierSelect>
                )}
              </NameFieldWrapper>
              <Label htmlFor="e164">active</Label>
              <Checkbox
                noLeftMargin
                name="active"
                id="active"
                label=""
                checked={carrierActive}
                onChange={e => setCarrierActive(e.target.checked)}
              />
              <hr style={{ margin: '0.5rem 0' }} />
            </StyledForm>
            <Tabs activeKey={activeTab} onChange={onChangeTab}>
              <TabPane tab="Voice" key="1">
                <StyledForm
                  large
                >
                  <Label htmlFor="e164">E.164 Syntax</Label>
                  <Checkbox
                    noLeftMargin
                    name="e164"
                    id="e164"
                    label="prepend a leading + on origination attempts"
                    checked={e164}
                    onChange={e => setE164(e.target.checked)}
                  />

                  <Label htmlFor="application">Application</Label>
                  <Select
                    name="application"
                    id="application"
                    value={application}
                    onChange={e => setApplication(e.target.value)}
                  >
                    <option value="">
                      {type === 'add'
                        ? '-- OPTIONAL: Application to invoke on calls arriving from this carrier --'
                        : '-- NONE --'
                      }
                    </option>
                    {applicationValues.map(a => (
                      <option
                        key={a.application_sid}
                        value={a.application_sid}
                      >
                        {a.name}
                      </option>
                    ))}
                  </Select>

                  <hr style={{ margin: '0.5rem -2rem' }} />

                  {
                    !authenticate ? (
                      <>
                        <Button
                          text
                          formLink
                          type="button"
                          onClick={e => setAuthenticate(!authenticate)}
                        >
                          Does your carrier require authentication on outbound calls?
                        </Button>
                      </>
                    ) : (
                      <>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          name="username"
                          id="username"
                          value={username}
                          onChange={e => setUsername(e.target.value)}
                          placeholder="SIP username for authenticating outbound calls"
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
                          placeholder="SIP password for authenticating outbound calls"
                          invalid={passwordInvalid}
                          ref={refPassword}
                        />
                        <div></div>
                        <Checkbox
                          noLeftMargin
                          name="register"
                          id="register"
                          label="Carrier requires SIP Register before sending outbound calls"
                          checked={register}
                          onChange={e => setRegister(e.target.checked)}
                        />
                        {
                          register ? (
                            <>
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
                            </>
                          ) : (
                            null
                          )
                        }
                      </>
                    )
                  }

                  <hr style={{ margin: '0.5rem -2rem' }} />

                  {
                    requiredTechPrefix ? (
                      <>
                        <Label htmlFor="techPrefix">Tech prefix</Label>
                        <Input
                          name="techPrefix"
                          id="techPrefix"
                          value={techPrefix}
                          onChange={e => setTechPrefix(e.target.value)}
                          placeholder="Tech Prefix"
                          invalid={techPrefixInvalid}
                          ref={refTechPrefix}
                        />
                      </>
                    ) : (
                      <>
                        <Button
                          text
                          formLink
                          type="button"
                          onClick={e => setRequiredTechPrefix(!requiredTechPrefix)}
                        >
                          Does your carrier require a tech prefix on outbound calls?
                        </Button>
                      </>
                    )
                  }

                  <hr style={{ margin: '0.5rem -2rem' }} />

                  {
                    suportSIP ? (
                      <>
                        <Label htmlFor="diversion">Diversion</Label>
                        <Input
                          name="diversion"
                          id="diversion"
                          value={diversion}
                          onChange={e => setDiversion(e.target.value)}
                          placeholder="Phone number or SIP URI"
                        />
                      </>
                    ) : (
                      <>
                        <Button
                          text
                          formLink
                          type="button"
                          onClick={() => setSupportSIP(!suportSIP)}
                        >
                          Does your carrier support the SIP Diversion header for authenticating the calling number?
                        </Button>
                      </>
                    )
                  }

                  <hr style={{ margin: '0.5rem -2rem' }} />

                  <div
                    style={{
                      whiteSpace: 'nowrap',
                      textAlign: 'left',
                      color: '#231f20'
                    }}
                  >SIP Gateways</div>
                  {
                    sipGateways.length
                    ? <div>{/* for CSS grid layout */}</div>
                    : null
                  }
                  <SIPGatewaysInputGroup>
                    <StyledLabel>{`Network Address / Port / Netmask`}</StyledLabel>
                  </SIPGatewaysInputGroup>
                  {sipGateways.map((g, i) => (
                    <SIPGatewaysInputGroup key={i}>
                      <Input
                        name={`sipGatewaysIp[${i}]`}
                        id={`sipGatewaysIp[${i}]`}
                        value={sipGateways[i].ip}
                        onChange={e => updateSipGateways(e, i, 'ip')}
                        placeholder={'1.2.3.4'}
                        invalid={sipGateways[i].invalidIp}
                        ref={ref => refIp.current[i] = ref}
                      />
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
                      <Select
                        name={`sipgatewaysNetmask[${i}]`}
                        id={`sipgatewaysNetmask[${i}]`}
                        value={sipGateways[i].netmask}
                        disabled={sipGateways[i].outbound}
                        onChange={e => updateSipGateways(e, i, 'netmask')}
                      >
                        {Array.from(Array(32 + 1).keys()).slice(1).reverse().map((item) => (
                          <option value={item} key={item}>{item}</option>
                        ))}
                      </Select>
                      <SIPGatewaysChecboxGroup>
                        <Checkbox
                          id={`inbound[${i}]`}
                          label={width > 1100 ? "Inbound" : "In"}
                          tooltip="Sends us calls"
                          checked={sipGateways[i].inbound}
                          onChange={e => updateSipGateways(e, i, 'inbound')}
                          invalid={sipGateways[i].invalidInbound}
                          ref={ref => refInbound.current[i] = ref}
                        />
                        <Checkbox
                          id={`outbound[${i}]`}
                          label={width > 1100 ? "Outbound" : "Out"}
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
                      </SIPGatewaysChecboxGroup>
                    </SIPGatewaysInputGroup>
                  ))}
                  <StyledButton
                    square
                    type="button"
                    onClick={addSipGateway}
                    ref={refAdd}
                  >
                    +
                  </StyledButton>
                </StyledForm>
              </TabPane>
              <TabPane tab="SMS" disabled={smpps.length === 0} key="2">
                <StyledSection>
                  <StyledLegend>Outbound SMPP</StyledLegend>
                  <Subtitle>{smppSubTitleForOutbound}</Subtitle>
                  <StyledForm
                    large
                  >
                    <Label htmlFor="smpp_system_id">System ID</Label>
                    <Input
                      name="smpp_system_id"
                      id="smpp_system_id"
                      value={smpp_system_id}
                      onChange={e => setSmppSystemId(e.target.value)}
                      placeholder="SIP username for authenticating outbound messages"
                      invalid={smpp_system_idInvalid}
                      ref={refSmppSystemId}
                    />
                    <Label htmlFor="smpp_password">Password</Label>
                    <PasswordInput
                      allowShowPassword
                      name="smpp_password"
                      id="smpp_password"
                      password={smpp_password}
                      setPassword={setSmppPassword}
                      setErrorMessage={setErrorMessage}
                      placeholder="SIP password for authenticating outbound messages"
                      invalid={smpp_passwordInvalid}
                      ref={refSmppPassword}
                    />

                    <div
                      style={{
                        whiteSpace: 'nowrap',
                        textAlign: 'left',
                        color: '#231f20',
                        width: '170px'
                      }}
                    >Carrier SMPP Gateways</div>
                    <div/>
                    <div/>
                    <SMPPGatewaysOutboundInputGroup>
                      <Label>IP or DNS name</Label>
                      <Label>Port</Label>
                      <Label>Use TLS</Label>
                    </SMPPGatewaysOutboundInputGroup>
                    {smppGateways.map((g, i) => (
                      g.outbound?
                      (<SMPPGatewaysOutboundInputGroup key={i}>
                        <Input
                          name={`smppGatewaysIp[${i}]`}
                          id={`smppGatewaysIp[${i}]`}
                          value={g.ipv4}
                          onChange={e => updateSmppGateways(e, i, 'ipv4')}
                          placeholder={'1.2.3.4'}
                          invalid={g.invalidIp}
                          ref={ref => refSmppIp.current[i] = ref}
                        />
                        <Input
                          width="5rem"
                          name={`smppGatewaysPort[${i}]`}
                          id={`smppGatewaysPort[${i}]`}
                          value={g.port}
                          onChange={e => updateSmppGateways(e, i, 'port')}
                          placeholder="2775"
                          invalid={g.invalidPort}
                          ref={ref => refSmppPort.current[i] = ref}
                        />
                        <Switch
                          id={`tls[${i}]`}
                          label="TLS"
                          tooltip="Use TLS"
                          checked={g.use_tls === 1}
                          onChange={e => updateSmppGateways(e, i, 'use_tls')}
                        />
                        {/* <Switch
                          id={`primary[${i}]`}
                          label="Primary"
                          tooltip="Is primary"
                          checked={g.is_primary === 1}
                          onChange={e => updateSmppGateways(e, i, 'is_primary')}
                        /> */}
                        <TrashButton
                          onClick={() => removeSmppGateway(i)}
                          ref={ref => refSmppTrash.current[i] = ref}
                        />
                      </SMPPGatewaysOutboundInputGroup>)
                      :
                      null
                    ))}
                    <div/>
                    <Button
                      square
                      type="button"
                      onClick={()=>addSmppGateway(false)}
                      ref={refAdd}
                    >
                      +
                    </Button>
                  </StyledForm>
                </StyledSection>
                <StyledSection>
                  <StyledLegend>Inbound SMPP</StyledLegend>
                  <Subtitle>{smppSubTitleForInbound}</Subtitle>
                  <StyledForm
                    large
                  >
                    <Label htmlFor="smpp_inbound_system_id">System ID</Label>
                    <Input
                      name="smpp_inbound_system_id"
                      id="smpp_inbound_system_id"
                      readOnly={true}
                      disabled={true}
                      value={smpp_inbound_system_id}
                      ref={refSmppInboundSystemId}
                    />
                    <Label htmlFor="smpp_inbound_password">Password</Label>
                    <PasswordInput
                      allowShowPassword
                      name="smpp_inbound_password"
                      id="smpp_inbound_password"
                      password={smpp_inbound_password}
                      setPassword={setSmppInboundPassword}
                      setErrorMessage={setErrorMessage}
                      placeholder="SIP password for authenticating inbound messages"
                      invalid={smpp_inbound_passwordInvalid}
                      ref={refSmppInboundPassword}
                    />

                    <div
                      style={{
                        whiteSpace: 'nowrap',
                        textAlign: 'left',
                        color: '#231f20',
                        width: '170px'
                      }}
                    >Carrier IP Address(es) to whitelist</div>
                    <div/>
                    <div/>
                    <SMPPGatewaysInboundInputGroup>
                      <Label>IP Address</Label>
                      <Label>Netmask</Label>
                    </SMPPGatewaysInboundInputGroup>
                    {smppGateways.map((g, i) => (
                      g.inbound?
                      (<SMPPGatewaysInboundInputGroup key={i}>
                        <Input
                          name={`smpppGatewaysIp[${i}]`}
                          id={`smpppGatewaysIp[${i}]`}
                          value={g.ipv4}
                          onChange={e => updateSmppGateways(e, i, 'ipv4')}
                          placeholder={'1.2.3.4'}
                          invalid={g.invalidIp}
                          ref={ref => refSmppIp.current[i] = ref}
                        />
                        {/* <Input
                          width="5rem"
                          name={`smpppGatewaysPort[${i}]`}
                          id={`smpppGatewaysPort[${i}]`}
                          value={g.port}
                          onChange={e => updateSmppGateways(e, i, 'port')}
                          placeholder="2775"
                          invalid={g.invalidPort}
                          ref={ref => refSmppPort.current[i] = ref}
                        /> */}
                        <Select
                          name={`smppgatewaysNetmask[${i}]`}
                          id={`smppgatewaysNetmask[${i}]`}
                          value={smppGateways[i].netmask}
                          disabled={smppGateways[i].outbound}
                          onChange={e => updateSmppGateways(e, i, 'netmask')}
                        >
                          {Array.from(Array(32 + 1).keys()).slice(1).reverse().map((item) => (
                            <option value={item} key={item}>{item}</option>
                          ))}
                        </Select>
                        <TrashButton
                          onClick={() => removeSmppGateway(i)}
                          ref={ref => refSmppTrash.current[i] = ref}
                        />
                        <div></div>
                      </SMPPGatewaysInboundInputGroup>)
                      :
                      null
                    ))}
                    <div/>
                    <Button
                      square
                      type="button"
                      onClick={()=>addSmppGateway(true)}
                      ref={refAdd}
                    >
                      +
                    </Button>
                  </StyledForm>
                </StyledSection>
              </TabPane>
            </Tabs>
          </>
        )}
        {errorMessage && (
          <StyledFormError grid message={errorMessage} />
        )}
        <StyledButtonGroup flexEnd spaced>
          <Button
            rounded="true"
            gray
            type="button"
            onClick={() => {
              history.push('/account/carriers');
              dispatch({
                type: 'ADD',
                level: 'info',
                message: type === 'add' ? 'New carrier canceled' :'Changes canceled',
              });
            }}
          >
            Cancel
          </Button>

          <Button rounded="true"
            onClick={handleSubmit}
          >
            {type === 'add'
              ? 'Add Carrier'
              : 'Save'
            }
          </Button>
        </StyledButtonGroup>
      </Section>
    </InternalMain>
  );
};

export default CarriersAddEdit;
