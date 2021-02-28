import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { NotificationDispatchContext } from '../../../contexts/NotificationContext';
import InternalTemplate from '../../../components/templates/InternalTemplate';
import Section from '../../../components/blocks/Section';
import TableContent from '../../../components/blocks/TableContent';
import sortSipGateways from '../../../helpers/sortSipGateways';

const CarriersIndex = () => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');

  const [ carriers, setCarriers ] = useState('');
  const [ sipRealm, setSipRealm ] = useState('');

  useEffect(() => {
    document.title = `Carriers | jambonz`;
  });

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

      if (usersMe && usersMe.data && usersMe.data.account) {
        setSipRealm(usersMe.data.account.sip_realm);
      }

      // Add appropriate gateways to each carrier
      const carriersWithGateways = carriersResults.data.map(t => {
        const gateways = gatewayResults.data.filter(g => t.voip_carrier_sid === g.voip_carrier_sid);
        sortSipGateways(gateways);
        return {
          ...t,
          gateways,
        };
      });

      const simplifiedCarriers = carriersWithGateways.map(t => ({
        sid:            t.voip_carrier_sid,
        name:           t.name,
        description:    t.description,
        gatewaysConcat: t.gateways.map(g => `${g.ipv4}:${g.port}`).join(', '),
        gatewaysList:   t.gateways.map(g => `${g.ipv4}:${g.port}`),
        gatewaysSid:    t.gateways.map(g => g.sip_gateway_sid),
      }));
      return(simplifiedCarriers);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
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
      ? 'SIP Gateways:'
      : 'SIP Gateway:';
    const gatewayContent = carrier.gatewaysList.length > 1
      ? carrier.gatewaysList
      : carrier.gatewaysList[0];
    return [
      { name: 'Name:',        content: carrier.name        || '[none]' },
      { name: 'Description:', content: carrier.description || '[none]' },
      { name: gatewayName,    content: gatewayContent    || '[none]' },
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
      // delete associated gateways
      for (const sid of carrierToDelete.gatewaysSid) {
        await axios({
          method: 'delete',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: `/SipGateways/${sid}`,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
      };
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
        localStorage.removeItem('token');
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

  //=============================================================================
  // Render
  //=============================================================================
  return (
    <InternalTemplate
      type="normalTable"
      title="Carriers"
      addButtonText="Add a Carriers"
      addButtonLink="/account/carriers/add"
      subtitle={sipRealm ? `Have your carrier${carriers.length > 1 ? 's' : ''} send calls to ${sipRealm}` : <>&nbsp;</>}
    >
      <Section normalTable>
        <TableContent
          normalTable
          name="carrier"
          urlParam="carriers"
          getContent={getCarriers}
          columns={[
            { header: 'Name',         key: 'name',           bold: true },
            { header: 'Description',  key: 'description',               },
            { header: 'SIP Gateways', key: 'gatewaysConcat',            },
          ]}
          formatContentToDelete={formatCarrierToDelete}
          deleteContent={deleteCarrier}
        />
      </Section>
    </InternalTemplate>
  );
};

export default CarriersIndex;
