import { useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { NotificationDispatchContext } from '../../../contexts/NotificationContext';
import InternalMain from '../../../components/wrappers/InternalMain';
import TableContent from '../../../components/blocks/TableContent';
import phoneNumberFormat from '../../../helpers/phoneNumberFormat';
import Section from '../../../components/blocks/Section';

const PhoneNumbersIndex = () => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');

  //=============================================================================
  // Get phone numbers
  //=============================================================================
  const getPhoneNumbers = async () => {
    try {
      const phoneNumbersPromise = axios({
        method: 'get',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: '/PhoneNumbers',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const applicationsPromise = axios({
        method: 'get',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: '/Applications',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const carriersPromise = axios({
        method: 'get',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: '/VoipCarriers',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const [
        phoneNumbers,
        applications,
        carriers,
      ] = await Promise.all([
        phoneNumbersPromise,
        applicationsPromise,
        carriersPromise,
      ]);

      // sort all applications and store to state for use in bulk editing
      const allApplications = [...applications.data, ];
      allApplications.sort((a, b) => {
        let valA = (a.name && a.name.toLowerCase()) || '';
        let valB = (b.name && b.name.toLowerCase()) || '';
        const result = valA > valB ? 1 : valA < valB ? -1 : 0;
        return result;
      });
      const applicationsForBulk = allApplications.map(app => ({
        name: app.name,
        application_sid: app.application_sid,
      }));
      applicationsForBulk.push({
        name: '- None -',
        application_sid: null,
      });
      setApplications(applicationsForBulk);

      const combinedData = phoneNumbers.data.map((p, i) => {
        const application = applications.data.filter(a => a.application_sid  === p.application_sid);
        const carrier = carriers.data.filter(a => a.voip_carrier_sid === p.voip_carrier_sid);
        return {
          sid:         p.phone_number_sid,
          number:      phoneNumberFormat(p.number),
          application: application[0] && application[0].name,
          carrier:     carrier[0] && carrier[0].name,
        };
      });
      return(combinedData);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('jwt');
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
          message: (err.response && err.response.data && err.response.data.msg) || 'Unable to get phone number data',
        });
        console.error(err.response || err);
      }
    }
  };

  //=============================================================================
  // Delete phone number
  //=============================================================================
  const formatPhoneNumberToDelete = p => {
    return [
      { name: 'Number:',      content: p.number      || '[none]' },
      { name: 'Carrier:',     content: p.carrier     || '[none]' },
      { name: 'Application:', content: p.application || '[none]' },
    ];
  };
  const deletePhoneNumber = async phoneNumber => {
    try {
      if (!jwt) {
        history.push('/');
        dispatch({
          type: 'ADD',
          level: 'error',
          message: 'You must log in to view that page.',
        });
        return;
      }
      await axios({
        method: 'delete',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/PhoneNumbers/${phoneNumber.sid}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return 'success';
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('jwt');
        sessionStorage.clear();
        history.push('/');
        dispatch({
          type: 'ADD',
          level: 'error',
          message: 'Your session has expired. Please log in and try again.',
        });
      } else {
        console.error(err.response || err);
        return ((err.response && err.response.data && err.response.data.msg) || 'Unable to delete phone number');
      }
    }
  };

  //=============================================================================
  // Bulk Edit Applications
  //=============================================================================
  const [ applications, setApplications ] = useState([]);
  const handleBulkEditApplications = async (phoneNumberSids, application) => {
    try {
      if (!jwt) {
        history.push('/');
        dispatch({
          type: 'ADD',
          level: 'error',
          message: 'You must log in to view that page.',
        });
        return;
      }
      for (const sid of phoneNumberSids) {
        await axios({
          method: 'put',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: `/PhoneNumbers/${sid}`,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          data: {
            application_sid: application.application_sid,
          }
        });
      }
      return true;
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('jwt');
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
          message: (err.response && err.response.data && err.response.data.msg) || 'Something went wrong, please try again.',
        });
        console.error(err.response || err);
      }
      return false;
    }
  };

  //=============================================================================
  // Render
  //=============================================================================
  return (
    <InternalMain
      type="normalTable"
      title="Phone Numbers"
      addButtonText="Add a Phone Number"
      addButtonLink="/account/phone-numbers/add"
    >
      <Section normalTable>
        <TableContent
          normalTable
          withCheckboxes
          name="phone number"
          urlParam="phone-numbers"
          getContent={getPhoneNumbers}
          columns={[
            { header: 'Number',      key: 'number',      bold: true },
            { header: 'Carrier',     key: 'carrier',                },
            { header: 'Application', key: 'application',            },
          ]}
          formatContentToDelete={formatPhoneNumberToDelete}
          deleteContent={deletePhoneNumber}
          bulkMenuItems={applications}
          bulkAction={handleBulkEditApplications}
        />
      </Section>
    </InternalMain>
  );
};

export default PhoneNumbersIndex;
