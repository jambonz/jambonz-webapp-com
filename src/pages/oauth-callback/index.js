import { useEffect, useContext } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { NotificationDispatchContext } from '../../contexts/NotificationContext';
import Loader from '../../components/blocks/Loader';

const OauthCallback = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useContext(NotificationDispatchContext);
  const { provider } = useParams();

  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    document.title = `Authenticating... | jambonz`;

    const authenticate = async () => {
      const queryParams = new URLSearchParams(location.search);
      const code = queryParams.get('code');
      const newState = queryParams.get('state');
      const originalState = localStorage.getItem('oauth-state');
      const previousLocation = localStorage.getItem('location-before-oauth');

      try {
        if (provider !== 'github' && provider !== 'google') {
          dispatch({
            type: 'ADD',
            level: 'error',
            message: `${provider} is not a valid OAuth provider`,
          });
          history.replace(previousLocation || '/');
          return;
        }

        if (!code || !originalState || !newState || (newState !== originalState)) {
          throw Error('Invalid state');
        }

        let oauth2_client_id;
        let oauth2_redirect_uri;

        if (provider === 'github') {
          oauth2_client_id = process.env.REACT_APP_GITHUB_CLIENT_ID;
          oauth2_redirect_uri = process.env.REACT_APP_GITHUB_REDIRECT_URI;
        } else if (provider === 'google') {
          oauth2_client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;
          oauth2_redirect_uri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
        }

        const response = await axios({
          method: 'post',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: '/register',
          data: {
            service_provider_sid: process.env.REACT_APP_SERVICE_PROVIDER_SID,
            provider,
            oauth2_code: code,
            oauth2_state: originalState,
            oauth2_client_id,
            oauth2_redirect_uri,
          },
          headers: previousLocation === '/account/settings/auth' ? {
            Authorization: `Bearer ${jwt}`,
          }: {},
        });

        localStorage.removeItem('oauth-state');
        localStorage.removeItem('location-before-oauth');

        if (response.status === 200) {

          localStorage.setItem('jwt',         response.data.jwt);
          localStorage.setItem('user_sid',    response.data.user_sid);
          localStorage.setItem('account_sid', response.data.account_sid);

          if (previousLocation === '/register') {

            localStorage.setItem('root_domain', response.data.root_domain);
            history.replace('/register/choose-a-subdomain');

          } else {

            history.replace('/account');

          }

          if (previousLocation === '/account/settings/auth') {
            dispatch({
              type: 'ADD',
              level: 'success',
              message: 'Your authentication method has been changed.',
            });
          }
        } else {
          throw Error('Non-200 response');
        }

      } catch (err) {
        history.replace(previousLocation);
        dispatch({
          type: 'ADD',
          level: 'error',
          message: (err.response && err.response.data && err.response.data.msg) ||
          err.message || 'Something went wrong, please try again.',
        });
        console.error(err.response || err);
      }
    };

    authenticate();

  }, [history, location, dispatch, provider, jwt]);

  return (
    <Loader height="calc(100vh - 20rem)" />
  );
};

export default OauthCallback;
