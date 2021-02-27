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
  height: calc(100vh - 4rem);
  width: calc(100% - 15rem);
  overflow: auto;

  ${props => props.type === 'fullWidthTable' ? `
    display: flex;
    flex-direction: column;
    padding-top: 2.5rem;
  ` : `
    padding: 2.5rem 3rem;
  `};
`;

const TopSection = styled.section`
  ${props => props.type === 'fullWidthTable' && `
    padding: 0 3rem;
  `}
`;

const Subtitle = styled.p`
  margin: -0.5rem 0 1.5rem;
`;

const ContentContainer = styled.div`
  ${props => props.type === 'form' && `
    max-width: 61rem;
  `}
  ${props => props.type === 'fullWidthTable' && `
    flex-grow: 1;
  `}
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
        sidebar={[]}
      />
      <div style={{ display: "flex" }}>
        <SideMenu />
        <PageMain type={props.type}>
          {props.breadcrumbs && (
            <Breadcrumbs breadcrumbs={props.breadcrumbs} />
          )}
          <TopSection type={props.type}>
            <H1>{props.title}</H1>
            {props.addButtonText && (
              <AddButton
                addButtonText={props.addButtonText}
                to={props.addButtonLink}
              />
            )}
            {props.subtitle
              ? <Subtitle>{props.subtitle}</Subtitle>
              : null
            }
          </TopSection>
          <ContentContainer
            type={props.type}
          >
            {props.children}
          </ContentContainer>

          {props.additionalTable && (
            <ContentContainer>
              {props.additionalTable}
            </ContentContainer>
          )}
        </PageMain>
      </div>
    </>
  );
};

export default InternalTemplate;
