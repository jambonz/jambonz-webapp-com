import { useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { NotificationDispatchContext } from '../../../contexts/NotificationContext';
import InternalMain from '../../../components/wrappers/InternalMain';
import Section from '../../../components/blocks/Section';
import TableContent from '../../../components/blocks/TableContent';
import sortSipGateways from '../../../helpers/sortSipGateways';

const CarriersIndex = () => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');

  const [ carriers, setCarriers ] = useState('');
  const [ sipRealm, setSipRealm ] = useState('');
  const [staticIPs, setStaticIPs] = useState(null);

  //=============================================================================
  // Get carriers
  //=============================================================================
  const getCarriers = async () => {
    try {
      // Get all carriers
      const carriersResultsPromise = axios({
        method: 'get',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: '/VoipCarriers',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      // Get all SIP gateways
      const gatewayResultsPromise = axios({
        method: 'get',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: '/SipGateways',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      // Get SIP realm via /Users/me
      const usersMePromise = axios({
        method: 'get',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: '/Users/me',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const [
        carriersResults,
        gatewayResults,
        usersMe,
      ] = await Promise.all([
        carriersResultsPromise,
        gatewayResultsPromise,
        usersMePromise,
      ]);

      setCarriers(carriersResults.data);

      // get application data
      let applicationSids = carriersResults.data
        .filter((item) => !!item.application_sid)
        .map((item) => item.application_sid);
      const applicationPromise = await Promise.all(
        applicationSids.map((apl) => {
          return axios({
            method: 'get',
            baseURL: process.env.REACT_APP_API_BASE_URL,
            url: `/Applications/${apl}`,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
        })
      );

      const applicationData = applicationPromise.map(item => item.data[0]);

      if (usersMe && usersMe.data && usersMe.data.account) {
        setSipRealm(usersMe.data.account.sip_realm);
        setStaticIPs(usersMe.data.account.static_ips || null);
      }

      // Add appropriate gateways to each carrier
      const carriersWithGateways = carriersResults.data.map(t => {
        const gateways = gatewayResults.data.filter(g => t.voip_carrier_sid === g.voip_carrier_sid);
        const application = applicationData.find(item => item.application_sid === t.application_sid);
        sortSipGateways(gateways);
        return {
          ...t,
          gateways,
          application,
        };
      });

      const simplifiedCarriers = carriersWithGateways.map(t => ({
        sid:            t.voip_carrier_sid,
        name:           t.name,
        status:    t.is_active === 1 ? "active" : "inactive",
        application: t.application ? t.application.name || null : null,
        gatewaysConcat: `${
          t.gateways.filter((item) => item.inbound === 1).length
        } inbound, ${
          t.gateways.filter((item) => item.inbound === 0).length
        } outbound`,
        gatewaysList:   t.gateways.map(g => `${g.ipv4}:${g.port}`),
        gatewaysSid:    t.gateways.map(g => g.sip_gateway_sid),
      }));
      return(simplifiedCarriers);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        history.push('/');
        dispatch({
          type: 'ADD',
          level: 'error',
          message: 'Your session has expired. Please log in and try again.',
        });
      } else {
        dispatch({
          type: 'ADD',
          level: 'error',
          message: (err.response && err.response.data && err.response.data.msg) || 'Unable to get carrier data',
        });
        console.error(err.response || err);
      }
    }
  };

  //=============================================================================
  // Delete carrier
  //=============================================================================
  const formatCarrierToDelete = carrier => {
    const gatewayName = carrier.gatewaysList.length > 1
      ? 'Gateways:'
      : 'Gateway:';

    return [
      { name: 'Name:', content: carrier.name || '[none]' },
      { name: 'Status:', content: carrier.status || '[none]' },
      { name: 'Application:', content: carrier.application || '[none]' },
      { name: gatewayName, content: carrier.gatewaysConcat || '[none]' },
    ];
  };

  const deleteCarrier = async carrierToDelete => {
    try {
      if (!localStorage.getItem('jwt')) {
        history.push('/');
        dispatch({
          type: 'ADD',
          level: 'error',
          message: 'You must log in to view that page.',
        });
        return;
      }
      // delete carrier
      await axios({
        method: 'delete',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/VoipCarriers/${carrierToDelete.sid}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return 'success';
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        history.push('/');
        dispatch({
          type: 'ADD',
          level: 'error',
          message: 'Your session has expired. Please log in and try again.',
        });
      } else {
        console.error(err.response || err);
        return ((err.response && err.response.data && err.response.data.msg) || 'Unable to delete carrier');
      }
    }
  };

  const getSubTitle = () => {
    let title = <>&nbsp;</>;
    if (sipRealm) {
      title = staticIPs
        ? `Have your carrier${carriers.length > 1 ? 's' : ''} send calls to your static IP(s): ${staticIPs.join(
            ", "
          )}`
        :  `Have your carrier${carriers.length > 1 ? 's' : ''} send calls to ${sipRealm}`;
    }
    return title;
  };

  //=============================================================================
  // Render
  //=============================================================================
  return (
    <InternalMain
      type="normalTable"
      title="Carriers"
      addButtonText="Add a Carriers"
      addButtonLink="/account/carriers/add"
      subtitle={getSubTitle()}
    >
      <Section normalTable>
        <TableContent
          normalTable
          name="carrier"
          urlParam="carriers"
          getContent={getCarriers}
          columns={[
            { header: 'Name', key: 'name', bold: true },
            { header: 'Status', key: 'status' },
            { header: 'Default Application', key: 'application' },
            { header: 'Gateways', key: 'gatewaysConcat' },
          ]}
          formatContentToDelete={formatCarrierToDelete}
          deleteContent={deleteCarrier}
        />
      </Section>
    </InternalMain>
  );
};

export default CarriersIndex;
