import { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components/macro';
import { NotificationDispatchContext } from '../../contexts/NotificationContext';
import Nav from '../blocks/Nav';
import SideMenu from '../blocks/SideMenu';
import H1 from '../elements/H1';
import AddButton from '../elements/AddButton';
import Breadcrumbs from '../blocks/Breadcrumbs';

const PageMain = styled.main`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 4rem);
  width: calc(100% - 15rem);
  margin-top: 4rem;
  padding: 2.5rem 3rem;
  overflow: auto;

  ${props => props.theme.mobileOnly} {
    width: 100%;
    padding: 1.5rem 1rem;
  }
`;

const TopSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: ${props => props.centerVertical ? 'center' : 'flex-start'};
  margin-bottom: 1.5rem;
`;

const Subtitle = styled.p`
  margin: 1rem 0 0;
`;

const ContentContainer = styled.div`
  ${props => props.type === 'form' && `
    max-width: 61rem;
  `}
  ${props => props.type === 'fullWidthTable' && `
    flex-grow: 1;
    margin: 0 -3rem -2.5rem;
  `}

  ${props => props.theme.mobileOnly} {
    ${props => (
      props.type === 'normalTable' ||
      props.type === 'fullWidthTable'
    ) && `
      flex-grow: 1;
      margin: 0 -1rem -1.5rem;
    `}
  }
`;

const InternalTemplate = props => {
  const history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const jwt = localStorage.getItem('jwt');

  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');

  useEffect(() => {
    try {

      const getData = async () => {
        const userResponse = await axios({
          method: 'get',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: '/Users/me',
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (userResponse.data && userResponse.data.user) {
          setName(userResponse.data.user.name);
          setEmail(userResponse.data.user.email);
        }
      };
      getData();

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
          message: (err.response && err.response.data && err.response.data.msg) ||
          err.message || 'Error getting navigation data',
        });
        console.error(err.response || err);
      }
    }
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
        <PageMain type={props.type}>
          {props.breadcrumbs && (
            <Breadcrumbs breadcrumbs={props.breadcrumbs} />
          )}
          <TopSection type={props.type} centerVertical={!props.subtitle}>
            <div>
              <H1>{props.title}</H1>
              {props.subtitle
                ? <Subtitle>{props.subtitle}</Subtitle>
                : null
              }
            </div>
            {props.addButtonText && (
              <AddButton
                addButtonText={props.addButtonText}
                to={props.addButtonLink}
              />
            )}
          </TopSection>
          <ContentContainer
            type={props.type}
          >
            {props.children}
          </ContentContainer>
        </PageMain>
      </div>
    </>
  );
};

export default InternalTemplate;
