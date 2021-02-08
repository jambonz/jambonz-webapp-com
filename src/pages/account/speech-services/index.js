import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { NotificationDispatchContext } from '../../../contexts/NotificationContext';
import InternalTemplate from '../../../components/templates/InternalTemplate';
import TableContent from '../../../components/blocks/TableContent.js';

const SpeechServicesIndex = () => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');
  const account_sid = localStorage.getItem('account_sid');

  useEffect(() => {
    document.title = `Speech Services | jambonz`;
  });

  //=============================================================================
  // Get speech services
  //=============================================================================
  const getSpeechServices = async () => {
    try {
      const speechServices = await axios({
        method: 'get',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Accounts/${account_sid}/SpeechCredentials`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const cleanedUpSpeechServices = speechServices.data.map(s => {
        return {
          sid: s.speech_credentials_sid,
          vendor: s.vendor,
          usage: (s.use_for_tts && s.use_for_stt) ? 'TTS/STT'
                : s.use_for_tts ? 'TTS'
                : s.use_for_stt ? 'STT'
                : 'None',
          last_used: s.last_used || 'Never used',
          status: (s.tts_tested_ok && s.stt_tested_ok) ? 'Pass' : 'Fail',
        };
      });
      return(cleanedUpSpeechServices);
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
          message: (err.response && err.response.data && err.response.data.msg) || 'Unable to get speech services',
        });
        console.error(err.response || err);
      }
    }
  };

  //=============================================================================
  // Delete speech service
  //=============================================================================
  const formatSpeechServiceToDelete = s => {
    return [
      { name: 'Vendor',    content: s.vendor    || '[none]' },
      { name: 'Usage',     content: s.usage     || '[none]' },
      { name: 'Last Used', content: s.last_used || 'Never' },
      { name: 'Status',    content: s.status    || '[none]' },
    ];
  };
  const deleteSpeechService = async speechServiceToDelete => {
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

      // Delete speech service
      await axios({
        method: 'delete',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Accounts/${account_sid}/SpeechCredentials/${speechServiceToDelete.sid}`,
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
        return ((err.response && err.response.data && err.response.data.msg) || 'Unable to delete speech service');
      }
    }
  };

  //=============================================================================
  // Render
  //=============================================================================
  return (
    <InternalTemplate
      title="Speech Services"
      addButtonText="Add Speech Service"
      addButtonLink="/account/speech-services/add"
    >
      <TableContent
        name="speech service"
        urlParam="speech-services"
        getContent={getSpeechServices}
        columns={[
          { header: 'Vendor',    key: 'vendor'    },
          { header: 'Usage',     key: 'usage'     },
          { header: 'Last Used', key: 'last_used' },
          { header: 'Status',    key: 'status'    },
        ]}
        formatContentToDelete={formatSpeechServiceToDelete}
        deleteContent={deleteSpeechService}
      />
    </InternalTemplate>
  );
};

export default SpeechServicesIndex;
