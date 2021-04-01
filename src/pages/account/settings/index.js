import { useState, useEffect, useContext } from 'react';
import { useHistory, Link as ReactRouterLink } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components/macro';
import { CurrentMenuStateContext, CurrentMenuDispatchContext } from '../../../contexts/CurrentMenuContext';
import { NotificationDispatchContext } from '../../../contexts/NotificationContext';
import { ModalStateContext } from '../../../contexts/ModalContext';
import InternalMain from '../../../components/wrappers/InternalMain';
import InputGroup from '../../../components/elements/InputGroup';
import Loader from '../../../components/blocks/Loader';
import Section from '../../../components/blocks/Section';
import TableMenu from '../../../components/blocks/TableMenu';
import Button from '../../../components/elements/Button';
import H2 from '../../../components/elements/H2';
import H3 from '../../../components/elements/H3';
import Table from '../../../components/elements/Table';
import Td from '../../../components/elements/Td';
import Th from '../../../components/elements/Th';
import Subscription from '../../../components/blocks/Subscription';
import ContactIconButton from '../../../components/elements/ContactIconButton';

const SimpleTable = styled.table`
  border-collapse: collapse;

  tr {
    display: grid;
    grid-template-columns: 78px 1fr;
    width: 100%;
    align-items: center;

    td {
      padding-bottom: 1rem;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    @media (max-width: 575px) {
      td {
        padding-left: 0;
      }      
    }
  }
`;

const StyledInputGroup = styled(InputGroup)`
  @media (max-width: 575px) {
    a, a > span {
      width: 100%;
      white-space: nowrap;
    }
  }
`;

const StyledTR = styled.tr`
  display: grid;
  grid-template-columns: 120px 1fr auto;
  width: 100%;
  align-items: center;

  @media (max-width: 575px) {
    th, td {
      padding: 1rem;
    }
  }
`;

const TruncatedTd = styled(Td)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const SettingsIndex = () => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const modalOpen = useContext(ModalStateContext);
  const currentMenu = useContext(CurrentMenuStateContext);
  const setCurrentMenu = useContext(CurrentMenuDispatchContext);
  const jwt = localStorage.getItem('jwt');

  const [ provider, setProvider ] = useState(null);
  const [ name, setName ] = useState(null);
  const [ email, setEmail ] = useState(null);
  const [ showLoader, setShowLoader ] = useState(true);
  const [ accountData, setAccountData ] = useState({});

  useEffect(() => {
    const getAPIData = async () => {
      let isMounted = true;
      try {
        const userDataResponse = await axios({
          method: 'get',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: `/Users/me`,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        const user = userDataResponse.data;
        setAccountData(user);

        if (user.user) {
          setProvider(user.user.provider || '');
          setName(user.user.name || '');
          setEmail(user.user.email || '');
        }

        setShowLoader(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          sessionStorage.clear();
          isMounted = false;
          history.push('/');
          dispatch({
            type: 'ADD',
            level: 'error',
            message: 'Your session has expired. Please log in and try again.',
          });
        } else {
          isMounted = false;
          history.push('/account');
          dispatch({
            type: 'ADD',
            level: 'error',
            message: (err.response && err.response.data && err.response.data.msg) || 'Unable to get settings data',
          });
          console.error(err.response || err);
        }
      } finally {
        if (isMounted) {
          setShowLoader(false);
        }
      }
    };
    getAPIData();
    // eslint-disable-next-line
  }, []);


  return (
    <InternalMain title="Settings">
      {showLoader ? <Loader /> : (
        <>
          <Section>
            <H2>Authentication Method</H2>
            {provider === 'local' ? (
              <p>
                You currently sign in with an email and password. Other
                options for authentication are GitHub, Google, Twitter.
              </p>
            ) : provider === 'github' ? (
              <>
                <p>You currently sign in with</p>
                <div>
                  <ContactIconButton type="github" absolute={false} />
                </div>
                <H3>Data from GitHub</H3>
                <SimpleTable>
                  <tbody>
                    <tr>
                      <Th simpleTable scope="row">Name</Th>
                      <Td simpleTable>{name}</Td>
                    </tr>
                    <tr>
                      <Th simpleTable scope="row">Email</Th>
                      <Td simpleTable>{email}</Td>
                    </tr>
                  </tbody>
                </SimpleTable>
              </>
            ) : (
              <p>You currently sign in with {provider}</p>
            )}
            <StyledInputGroup flexEnd>
              <Button as={ReactRouterLink} gray="true" to="/account/settings/auth">Change Authentication Method</Button>
            </StyledInputGroup>
          </Section>

          {provider === 'local' && (
            <Section>
              <H2>Your Information</H2>
              <Table>
                <tbody>
                  <StyledTR>
                    <Th scope="row">Name</Th>
                    <TruncatedTd>{name}</TruncatedTd>
                    <Td containsMenuButton>
                      <TableMenu
                        open={currentMenu === 'settings-name'}
                        handleCurrentMenu={() => setCurrentMenu('settings-name')}
                        disabled={modalOpen}
                        menuItems={[
                          {
                            name: 'Edit',
                            type: 'link',
                            url: `/account/settings/name`,
                          },
                        ]}
                      />
                    </Td>
                  </StyledTR>
                  <StyledTR>
                    <Th scope="row">Email</Th>
                    <TruncatedTd>{email}</TruncatedTd>
                    <Td containsMenuButton>
                      <TableMenu
                        open={currentMenu === 'settings-email'}
                        handleCurrentMenu={() => setCurrentMenu('settings-email')}
                        disabled={modalOpen}
                        menuItems={[
                          {
                            name: 'Change Email',
                            type: 'link',
                            url: `/account/settings/email`,
                          },
                        ]}
                      />
                    </Td>
                  </StyledTR>
                  <StyledTR>
                    <Th scope="row">Password</Th>
                    <TruncatedTd>************</TruncatedTd>
                    <Td containsMenuButton>
                      <TableMenu
                        open={currentMenu === 'settings-password'}
                        handleCurrentMenu={() => setCurrentMenu('settings-password')}
                        disabled={modalOpen}
                        menuItems={[
                          {
                            name: 'Change Password',
                            type: 'link',
                            url: `/account/settings/password`,
                          },
                        ]}
                      />
                    </Td>
                  </StyledTR>
                </tbody>
              </Table>
            </Section>
          )}

          <Section>
            <Subscription data={accountData} hasDelete={true} />
          </Section>
        </>
      )}
    </InternalMain>
  );
};

export default SettingsIndex;
