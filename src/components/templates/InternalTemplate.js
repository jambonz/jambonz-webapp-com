import { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { NotificationDispatchContext } from '../../contexts/NotificationContext';
import handleErrors from '../../helpers/handleErrors';
import Nav from '../blocks/Nav';
import SideMenu from '../blocks/SideMenu';

const InternalTemplate = props => {
  const history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');

  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');

  useEffect(() => {

    const getData = async () => {
      try {
        const userResponse = await axios({
          method: 'get',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: '/Users/me',
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!userResponse.data || !userResponse.data.user || !userResponse.data.account) {
          throw new Error('Unable to get navigation data.');
        }

        // If user hasn't finished registration send them back
        if (!userResponse.data.account.sip_realm) {

          localStorage.setItem('root_domain', userResponse.data.account.root_domain);

          if (!userResponse.data.user.email_validated) {
            history.push('/register/verify-your-email');
          } else {
            history.push('/register/choose-a-subdomain');
          }
        }

        setName(userResponse.data.user.name);
        setEmail(userResponse.data.user.email);

      } catch (err) {
        handleErrors({ err, history, dispatch, fallbackMessage: 'Error getting navigation data' });
      }
    };
    getData();
    // eslint-disable-next-line
  }, []);

  const signOut = () => {
    const jwt = localStorage.getItem('jwt');
    // not using async/await because the user's storage should be cleared
    // and they should be redirected to the login page regardless of whether
    // or not the API finds the user's JWT
    axios({
      method: 'post',
      baseURL: process.env.REACT_APP_API_BASE_URL,
      url: '/logout',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    localStorage.clear();
    sessionStorage.clear();
    history.push('/');
    dispatch({
      type: 'ADD',
      level: 'success',
      message: "You've successfully logged out",
    });
  };

  return (
    <>
      <Nav
        topLeft={[
          { type: 'link', text: 'jambonz', url: '/account' },
        ]}
        topRight={[
          {
            type: 'submenu',
            text: 'Account',
            desktopOnly: true,
            content: [
              {
                type: 'text-large',
                text: name,
              },
              {
                type: 'text',
                text: email,
              },
              {
                type: 'horizontal-rule',
              },
              {
                type: 'link',
                text: 'Account Settings',
                url: '/account/settings',
              },
              {
                type: 'button',
                text: 'Sign Out',
                onClick: signOut,
              },
            ],
          },
        ]}
        drawer={[
          {
            type: 'text-large',
            text: name,
          },
          {
            type: 'text',
            text: email,
          },
          {
            type: 'horizontal-rule',
          },
          {
            type: 'link',
            text: 'Home',
            url: '/account',
          },
          {
            type: 'link',
            text: 'Applications',
            url: '/account/applications',
          },
          {
            type: 'link',
            text: 'Recent Calls',
            url: '/account/recent-calls',
          },
          {
            type: 'link',
            text: 'Alerts',
            url: '/account/alerts',
          },
          {
            type: 'horizontal-rule',
          },
          {
            type: 'text',
            text: 'Bring Your Own Services',
          },

          {
            type: 'link',
            text: 'Carriers',
            url: '/account/carriers',
          },
          {
            type: 'link',
            text: 'Phone Numbers',
            url: '/account/phone-numbers',
          },
          {
            type: 'link',
            text: 'Speech',
            url: '/account/speech-services',
          },
          {
            type: 'horizontal-rule',
          },
          {
            type: 'link',
            text: 'Account Settings',
            url: '/account/settings',
          },
          {
            type: 'button',
            text: 'Sign Out',
            onClick: signOut,
          },
        ]}
        drawerAlignment="left"
      />
      <div style={{ display: "flex" }}>
        <SideMenu />
        {props.children}
      </div>
    </>
  );
};

export default InternalTemplate;
