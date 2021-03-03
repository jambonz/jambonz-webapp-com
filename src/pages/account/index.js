import { useState, useEffect, useContext } from 'react';
import { Link as ReactRouterLink, useHistory } from 'react-router-dom';
import axios from 'axios';
import { CurrentMenuStateContext, CurrentMenuDispatchContext } from '../../contexts/CurrentMenuContext';
import { NotificationDispatchContext } from '../../contexts/NotificationContext';
import { ModalStateContext } from '../../contexts/ModalContext';
import InternalMain from '../../components/wrappers/InternalMain';
import AccountSetupList from '../../components/blocks/AccountSetupList';
import Section from '../../components/blocks/Section';
import TableMenu from '../../components/blocks/TableMenu';
import InputGroup from '../../components/elements/InputGroup';
import H2 from '../../components/elements/H2';
import Button from '../../components/elements/Button';
import P from '../../components/elements/P';
import Table from '../../components/elements/Table';
import Th from '../../components/elements/Th';
import Td from '../../components/elements/Td';
import handleErrors from '../../helpers/handleErrors';
import maskApiToken from '../../helpers/maskApiToken';
import Loader from '../../components/blocks/Loader';

const AccountHome = () => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const modalOpen = useContext(ModalStateContext);
  const currentMenu = useContext(CurrentMenuStateContext);
  const setCurrentMenu = useContext(CurrentMenuDispatchContext);

  const jwt = localStorage.getItem('jwt');
  const account_sid = localStorage.getItem('account_sid');

  // Clean up OAuth localStorage
  localStorage.removeItem('oauth-state');
  localStorage.removeItem('location-before-oauth');

  const [ data,                         setData                         ] = useState({});
  const [ registrationWebhookUrl,       setRegistrationWebhookUrl       ] = useState('');
  const [ registrationWebhookMenuItems, setRegistrationWebhookMenuItems ] = useState([]);
  const [ showLoader,                   setShowLoader                   ] = useState(true);

  const copyText = async ({ text, textType }) => {
    try {
      await navigator.clipboard.writeText(text);
      dispatch({
        type: 'ADD',
        level: 'success',
        message: `${textType} copied to clipboard`,
      });
    } catch (err) {
      dispatch({
        type: 'ADD',
        level: 'error',
        message: `Unable to copy ${textType}, please select the text and right click to copy`,
      });
    }
  };

  const addApiKey = async () => {
    try {
      const apiKeyResponse = await axios({
        method: 'post',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/ApiKeys`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data: {
          account_sid,
        },
      });
      const newApiKeySid = apiKeyResponse.data && apiKeyResponse.data.sid;
      history.push({
        pathname: `/account/api-keys/${newApiKeySid}/new`,
        state: { token: apiKeyResponse.data.token },
      });

    } catch (err) {
      dispatch({
        type: 'ADD',
        level: 'error',
        message: `Error creating API key: ${err.message}`
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
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

        setData(userResponse.data);

        if (userResponse.data.account && userResponse.data.account.registration_hook_sid) {
          const webhook_sid = userResponse.data.account.registration_hook_sid;
          const regWebhookResponse = await axios({
            method: 'get',
            baseURL: process.env.REACT_APP_API_BASE_URL,
            url: `/Webhooks/${webhook_sid}`,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });

          if (regWebhookResponse.data && regWebhookResponse.data.url) {
            setRegistrationWebhookUrl(regWebhookResponse.data.url);
          }

          setRegistrationWebhookMenuItems([
            {
              name: 'Edit',
              type: 'link',
              url: `/account/registration-webhook/${webhook_sid}/edit`,
            },
            {
              name: 'Delete',
              type: 'link',
              url: `/account/registration-webhook/${webhook_sid}/delete`,
            },
          ]);
        } else {
          setRegistrationWebhookMenuItems([
            {
              name: 'Add',
              type: 'link',
              url: `/account/registration-webhook/add`,
            },
          ]);
        }
      } catch (err) {
        isMounted = false;
        handleErrors({ err, history, dispatch, fallbackMessage: 'fine' });
      } finally {
        if (isMounted) {
          setShowLoader(false);
        }
      }
    };

    getData();
  }, [ jwt, dispatch, history ]);

  return (
    <InternalMain title="Home" metaTitle="Account Home">
      {showLoader ? (
        <Loader height="calc(100vh - 24rem)" />
      ) : (
        <>
          <Section>
            <H2>Your Subscription</H2>
            <P>
              You are currently on the Free plan (trial period). You are limited to 10
              simultaneous calls and 10 registered devices
            </P>
            <InputGroup flexEnd spaced>
              <Button as={ReactRouterLink} to="#">Upgrade to a Paid Subscription</Button>
            </InputGroup>
          </Section>

          <Section>
            <H2>Account Setup</H2>
            <P>1 of 4 steps complete</P>
            <AccountSetupList />
          </Section>

          {data.account && (
            <Section>
              <H2>Account</H2>
              <Table>
                <tbody>
                  <tr>
                    <Th scope="row">SIP Realm</Th>
                    <Td>{data.account.sip_realm}</Td>
                    <Td containsMenuButton>
                      <TableMenu
                        open={currentMenu === 'account-home-sip-realm'}
                        handleCurrentMenu={() => setCurrentMenu('account-home-sip-realm')}
                        disabled={modalOpen}
                        menuItems={[
                          {
                            name: 'Edit',
                            type: 'link',
                            url: `/account/sip-realm/edit`,
                          },
                        ]}
                      />
                    </Td>
                  </tr>
                  <tr>
                    <Th scope="row">Account SID</Th>
                    <Td>{data.account.account_sid}</Td>
                    <Td containsMenuButton>
                      <TableMenu
                        open={currentMenu === 'account-home-account-sid'}
                        handleCurrentMenu={() => setCurrentMenu('account-home-account-sid')}
                        disabled={modalOpen}
                        menuItems={[
                          {
                            name: 'Copy',
                            type: 'button',
                            action: () => copyText({
                              text: data.account.account_sid,
                              textType: 'Account SID',
                            }),
                          },
                        ]}
                      />
                    </Td>
                  </tr>
                  <tr>
                    <Th scope="row">Registration Webhook</Th>
                    <Td>{registrationWebhookUrl || 'None'}</Td>
                    <Td containsMenuButton>
                      <TableMenu
                        open={currentMenu === 'account-home-registration-webhook'}
                        handleCurrentMenu={() => setCurrentMenu('account-home-registration-webhook')}
                        disabled={modalOpen}
                        menuItems={registrationWebhookMenuItems}
                      />
                    </Td>
                  </tr>
                </tbody>
              </Table>
            </Section>
          )}

          {data.api_keys && (
            <Section>
              <Table sectionTableWithHeader>
                <thead>
                  <tr>
                    <Th sectionTableWithHeader>
                      <H2 inTable>API Keys</H2>
                    </Th>
                    <Th sectionTableWithHeader>
                      {data.api_keys.length ? 'Last Used' : ''}
                    </Th>
                    <Th sectionTableWithHeader containsSquareButton>
                      <Button square onClick={addApiKey}>+</Button>
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {!data.api_keys.length ? (
                    <tr>
                      <Td>No API Keys</Td>
                      <Td></Td>
                      <Td></Td>
                    </tr>
                  ) : (
                    data.api_keys.map(apiKey => (
                      <tr key={apiKey.api_key_sid}>
                        <Th scope="row">{maskApiToken(apiKey.token)}</Th>
                        <Td>{apiKey.last_used || 'Never used'}</Td>
                        <Td containsMenuButton>
                          <TableMenu
                            open={currentMenu === `account-home-api-key-${apiKey.api_key_sid}`}
                            handleCurrentMenu={() => setCurrentMenu(`account-home-api-key-${apiKey.api_key_sid}`)}
                            disabled={modalOpen}
                            menuItems={[
                              {
                                name: 'Copy Key',
                                type: 'button',
                                action: () => copyText({
                                  text: apiKey.token,
                                  textType: 'API key',
                                }),
                              },
                              {
                                name: 'View Key',
                                type: 'link',
                                url: `/account/api-keys/${apiKey.api_key_sid}`,
                              },
                              {
                                name: 'Delete',
                                type: 'link',
                                url: `/account/api-keys/${apiKey.api_key_sid}/delete`,
                              },
                            ]}
                          />
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Section>
          )}

          {data.products && data.balance && (
            <Section>
              <H2>Capacity and Balance</H2>
              <Table>
                <tbody>
                  <tr>
                    <Th scope="row">Max simultaneous calls</Th>
                    <Td textAlign="right">{data.products.find(product => product.category === 'devices').quantity}</Td>
                  </tr>
                  <tr>
                    <Th scope="row">Max simultaneous registered devices</Th>
                    <Td textAlign="right">{data.products.find(product => product.category === 'calls').quantity}</Td>
                  </tr>
                  <tr>
                    <Th scope="row">Prepaid balance</Th>
                    <Td textAlign="right">{data.balance.balance ? `$${data.balance.balance}` : ''}</Td>
                  </tr>
                </tbody>
              </Table>
              <InputGroup flexEnd>
                <Button gray disabled>Add Capacity of Funds (coming soon)</Button>
              </InputGroup>
            </Section>
          )}
        </>
      )}
    </InternalMain>
  );
};

export default AccountHome;
