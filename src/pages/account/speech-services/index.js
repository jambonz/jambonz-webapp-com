import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { NotificationDispatchContext } from '../../../contexts/NotificationContext';
import handleErrors from '../../../helpers/handleErrors';
import InternalMain from '../../../components/wrappers/InternalMain';
import Section from '../../../components/blocks/Section';
import TableContent from '../../../components/blocks/TableContent';

const SpeechServicesIndex = () => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');
  const account_sid = localStorage.getItem('account_sid');

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

      const credentialTestPromises = speechServices.data.map(s => {
        if (s.use_for_stt || s.use_for_tts) {
          return axios({
            method: 'get',
            baseURL: process.env.REACT_APP_API_BASE_URL,
            url: `/Accounts/${account_sid}/SpeechCredentials/${s.speech_credential_sid}/test`,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
        }
        return null;
      });

      const testResposes = await Promise.all(credentialTestPromises);

      const cleanedUpSpeechServices = speechServices.data.map((s, i) => {
        const testResults = testResposes[i] && testResposes[i].data;

        let content = null;
        let title = null;

        if (s.use_for_tts && s.use_for_stt) {

          if (testResults.tts.status === 'ok' && testResults.stt.status === 'ok') {
            content = 'ok';
            title = 'Connection test successful';
          } else {
            content = 'fail';

            if (testResults.tts.reason && testResults.stt.reason) {

              if (testResults.tts.reason === testResults.stt.reason) {
                title = testResults.tts.reason;
              } else {
                title = `TTS: ${testResults.tts.reason}. STT: ${testResults.stt.reason}`;
              }

            } else if (testResults.tts.reason) {
              title = `TTS: ${testResults.tts.reason}`;

            } else if (testResults.stt.reason) {
              title = `STT: ${testResults.stt.reason}`;
            }
          }

        } else if (s.use_for_tts) {

          content = testResults.tts.status;
          title = testResults.tts.status === 'ok'
            ? 'Connection test successful'
            : testResults.tts.reason;

        } else if (s.use_for_stt) {

          content = testResults.stt.status;
          title = testResults.stt.status === 'ok'
            ? 'Connection test successful'
            : testResults.stt.reason;

        }

        const { last_used } = s;
        let lastUsedString = 'Never used';
        if (last_used) {
          const currentDate = new Date();
          const lastUsedDate = new Date(last_used);
          currentDate.setHours(0,0,0,0);
          lastUsedDate.setHours(0,0,0,0);
          const daysDifference = Math.round((currentDate - lastUsedDate) / 1000 / 60 / 60 / 24);
          lastUsedString = daysDifference > 1
            ? `${daysDifference} days ago`
            : daysDifference === 1
              ? 'Yesterday'
              : daysDifference === 0
                ? 'Today'
                : 'Never used';
        }
        return {
          sid: s.speech_credential_sid,
          vendor: s.vendor,
          usage: (s.use_for_tts && s.use_for_stt) ? 'TTS/STT'
                : s.use_for_tts ? 'TTS'
                : s.use_for_stt ? 'STT'
                : 'Not in use',
          last_used: lastUsedString,
          status: {
            type: 'status',
            content,
            title,
          },
        };
      });
      return(cleanedUpSpeechServices);
    } catch (err) {
      handleErrors({ err, history, dispatch, fallbackMessage: 'Unable to get speech services' });
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
        return ((err.response && err.response.data && err.response.data.msg) || 'Unable to delete speech service');
      }
    }
  };

  //=============================================================================
  // Render
  //=============================================================================
  return (
    <InternalMain
      type="normalTable"
      title="Speech Services"
      addButtonText="Add Speech Service"
      addButtonLink="/account/speech-services/add"
    >
      <Section normalTable>
        <TableContent
          normalTable
          name="speech service"
          urlParam="speech-services"
          getContent={getSpeechServices}
          columns={[
            { header: 'Vendor',    key: 'vendor',    bold: true          },
            { header: 'Usage',     key: 'usage',                         },
            { header: 'Last Used', key: 'last_used',                     },
            { header: 'Status',    key: 'status',    textAlign: 'center' },
          ]}
          formatContentToDelete={formatSpeechServiceToDelete}
          deleteContent={deleteSpeechService}
        />
      </Section>
    </InternalMain>
  );
};

export default SpeechServicesIndex;
