import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { NotificationDispatchContext } from '../../../contexts/NotificationContext';
import InternalTemplate from '../../../components/templates/InternalTemplate';
import Section from '../../../components/blocks/Section';
import TableContent from '../../../components/blocks/TableContent';
import phoneNumberFormat from '../../../helpers/phoneNumberFormat';
import timeFormat from '../../../helpers/timeFormat';

const RecentCallsIndex = () => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');
  const account_sid = localStorage.getItem('account_sid');

  useEffect(() => {
    document.title = `Recent Calls | jambonz`;
  });

  //=============================================================================
  // Get recent calls
  //=============================================================================
  const getRecentCalls = async () => {
    try {
      const recentCalls = await axios({
        method: 'get',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Accounts/${account_sid}/CallBillingRecords`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const simplifiedRecentCalls = recentCalls.data.map(call => {
        return {
          sid:            call.call_billing_record_sid,
          date:           call.started_at,
          direction:      call.direction,
          from:           phoneNumberFormat(call.from),
          to:             phoneNumberFormat(call.to),
          status:         call.status,
          duration:       timeFormat(call.duration),
          amount_charged: {
            type: call.amount_charged ? 'link' : null,
            content: call.amount_charged ? `$${call.amount_charged}` : null,
            url: call.amount_charged ? `/account/recent-calls/${call.call_billing_record_sid}` : null,
          },
        };
      });
      return(simplifiedRecentCalls);
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
          message: (err.response && err.response.data && err.response.data.msg) || 'Unable to get recent call data',
        });
        console.error(err.response || err);
      }
    }
  };

  //=============================================================================
  // Render
  //=============================================================================
  return (
    <InternalTemplate
      type="fullWidthTable"
      title="Recent Calls"
    >
      <Section fullPage>
        <TableContent
          fullWidth
          noMenuOnRows
          condensed
          name="recent call"
          getContent={getRecentCalls}
          columns={[
            { header: 'Date',           key: 'date',                                },
            { header: 'Direction',      key: 'direction'                            },
            { header: 'From',           key: 'from'                                 },
            { header: 'To',             key: 'to'                                   },
            { header: 'Status',         key: 'status'                               },
            { header: 'Duration',       key: 'duration',       textAlign: 'right'   },
            { header: 'Amount Charged', key: 'amount_charged', textAlign: 'right'   },
          ]}
        />
      </Section>
    </InternalTemplate>
  );
};

export default RecentCallsIndex;
