import { useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { NotificationDispatchContext } from '../../contexts/NotificationContext';
import Loader from '../../components/blocks/Loader.js';

const OauthCallbackGithub = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useContext(NotificationDispatchContext);

  useEffect(() => {
    document.title = `Authenticating... | Jambonz`;

    const authenticateWithGithub = async () => {
      const queryParams = new URLSearchParams(location.search);
      const code = queryParams.get('code');
      const newState = queryParams.get('state');
      const originalState = localStorage.getItem('oauth-github-state');
      const previousLocation = localStorage.getItem('location-before-oauth');

      try {
        if (!originalState) {
          history.push(previousLocation || '/');
          return;
        }

        if (!code || !newState || (newState !== originalState)) {
          throw Error('Invalid state');
        }

        const response = await axios({
          method: 'post',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: '/register',
          data: {
            service_provider_sid: process.env.REACT_APP_SERVICE_PROVIDER_SID,
            provider: 'github',
            oauth2_code: code,
            oauth2_state: originalState,
            oauth2_client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
            oauth2_redirect_uri: process.env.REACT_APP_GITHUB_REDIRECT_URI,
          },
        });

        localStorage.removeItem('oauth-github-state');

        localStorage.setItem('jwt',         response.data.jwt);
        localStorage.setItem('user_sid',    response.data.user_sid);
        localStorage.setItem('account_sid', response.data.account_sid);
        localStorage.setItem('provider',    response.data.provider);
        localStorage.setItem('root_domain', response.data.root_domain);

        if (response.status === 200) {
          history.replace('/register/choose-a-subdomain');
        } else {
          throw Error('Non-200 response');
        }

      } catch(err) {
        console.error(err);
        history.push(previousLocation);
        dispatch({
          type: 'ADD',
          level: 'error',
          message: 'Something went wrong, please try again.',
        });
      }
    };

    authenticateWithGithub();

  }, [history, location, dispatch]);

  return (
    <Loader />
  );
};

export default OauthCallbackGithub;
