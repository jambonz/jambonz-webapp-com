import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { NotificationDispatchContext } from '../../../contexts/NotificationContext';
import handleErrors from '../../../helpers/handleErrors';
import InternalMain from '../../../components/wrappers/InternalMain';
import Section from '../../../components/blocks/Section';
import TableContent from '../../../components/blocks/TableContent';

const ApplicationsIndex = () => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');
  const account_sid = localStorage.getItem('account_sid');

  //=============================================================================
  // Get applications
  //=============================================================================
  const getApplications = async () => {
    try {
      const applications = await axios({
        method: 'get',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: '/Applications',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const simplifiedApplications = applications.data.map(app => {
        return {
          sid:                app.application_sid,
          name:               app.name,
          call_hook_url:      app.call_hook && app.call_hook.url,
          status_hook_url:    app.call_status_hook && app.call_status_hook.url,
          messaging_hook_url: app.messaging_hook && app.messaging_hook.url,
        };
      });
      return(simplifiedApplications);
    } catch (err) {
      handleErrors({ err, history, dispatch, fallbackMessage: 'Unable to get application data' });
    }
  };

  //=============================================================================
  // Delete application
  //=============================================================================
  const formatApplicationToDelete = app => {
    return [
      { name: 'Name:',                content: app.name               || '[none]' },
      { name: 'Calling Webhook:',     content: app.call_hook_url      || '[none]' },
      { name: 'Call Status Webhook:', content: app.status_hook_url    || '[none]' },
      { name: 'Messaging Webhook:',   content: app.messaging_hook_url || '[none]' },
    ];
  };
  const deleteApplication = async applicationToDelete => {
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

      // If application is being used as the test app, set the test app to null
      const userData = await axios({
        method: 'get',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: '/Users/me',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (
        userData.data &&
        userData.data.testapp &&
        userData.data.testapp.application_sid &&
        userData.data.testapp.application_sid === applicationToDelete.sid
      ) {
        await axios({
          method: 'put',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: `/Accounts/${account_sid}`,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          data: {
            test_call_application_sid: null,
          },
        });
      }

      // Check if any Microsoft Teams Tenants use this application
      const msTeamsTenants = await axios({
        method: 'get',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: '/MicrosoftTeamsTenants',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const appMsTeamsTenants = msTeamsTenants.data.filter(tenant => (
        tenant.application_sid === applicationToDelete.sid
      ));

      let errorMessages = [];

      for (const tenant of appMsTeamsTenants) {
        errorMessages.push(`Microsoft Teams Tenant: ${tenant.tenant_fqdn}`);
      }
      if (errorMessages.length) {
        return (
          <>
            <p style={{ margin: '0.5rem 0' }}>
              This application cannot be deleted because it is in use by:
            </p>
            <ul style={{ margin: '0.5rem 0' }}>
              {errorMessages.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </>
        );
      }

      // Delete application
      await axios({
        method: 'delete',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Applications/${applicationToDelete.sid}`,
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
        return ((err.response && err.response.data && err.response.data.msg) || 'Unable to delete application');
      }
    }
  };

  //=============================================================================
  // Render
  //=============================================================================
  return (
    <InternalMain
      type="normalTable"
      title="Applications"
      addButtonText="Add an Application"
      addButtonLink="/account/applications/add"
    >
      <Section normalTable>
        <TableContent
          normalTable
          name="application"
          urlParam="applications"
          getContent={getApplications}
          columns={[
            { header: 'Name',                key: 'name',            bold: true },
            { header: 'Calling Webhook',     key: 'call_hook_url',              },
            { header: 'Call Status Webhook', key: 'status_hook_url',            },
          ]}
          formatContentToDelete={formatApplicationToDelete}
          deleteContent={deleteApplication}
        />
      </Section>
    </InternalMain>
  );
};

export default ApplicationsIndex;
