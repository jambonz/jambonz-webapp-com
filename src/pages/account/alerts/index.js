import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components/macro';
import { NotificationDispatchContext } from '../../../contexts/NotificationContext';
import InternalMain from '../../../components/wrappers/InternalMain';
import Button from '../../../components/elements/Button';
import InputGroup from '../../../components/elements/InputGroup';
import Section from '../../../components/blocks/Section';
import TableContent from '../../../components/blocks/TableContent';
import dateTimeFormat from '../../../helpers/dateTimeFormat';
import alertType from '../../../helpers/alertType';

const StyledInputGroup = styled(InputGroup)`
  margin: 0 2rem 1.5rem;
`;

const AlertsIndex = () => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');
  const account_sid = localStorage.getItem('account_sid');
  //=============================================================================
  // Get alerts
  //=============================================================================
  const getAlerts = async () => {
    try {
      const alerts = await axios({
        method: 'get',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Accounts/${account_sid}/Alerts`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const simplififedAlerts = alerts.data.map(alert => ({
        sid: alert.alert_sid,
        type: alertType(alert.alert_type),
        call_sid: alert.call_sid,
        date: dateTimeFormat(alert.occurred_at, 'YYYY-MM-DD h:mm:ss'),
        description: '',
        details: '',
      }));

      return simplififedAlerts;
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
          message: (err.response && err.response.data && err.response.data.msg) || 'Unable to get recent call data',
        });
        console.error(err.response || err);
      }
    }
  };

  return (
    <InternalMain type="fullWidthTable" title="Alerts">
      <StyledInputGroup flexEnd spaced>
        <Button gray="true" style={{ marginBotton: '1rem !important' }}>Download as CSV</Button>
      </StyledInputGroup>
      <Section>
        <TableContent
            fullWidth
            noMenuOnRows
            condensed
            name="alerts"
            getContent={getAlerts}
            columns={[
              { header: 'Date',           key: 'date',      },
              { header: 'Type',           key: 'type'       },
              { header: 'Description',    key: 'description'},
              { header: 'Details',        key: 'details'    },
            ]}
          />
      </Section>
    </InternalMain>
  );
};

export default AlertsIndex;
