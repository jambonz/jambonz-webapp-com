import { useState, useEffect, useContext } from 'react';
import { Link as ReactRouterLink, useHistory } from 'react-router-dom';
import axios from 'axios';
import { CurrentMenuStateContext, CurrentMenuDispatchContext } from '../../contexts/CurrentMenuContext';
import { NotificationDispatchContext } from '../../contexts/NotificationContext';
import { ModalStateContext } from '../../contexts/ModalContext';
import InternalTemplate from '../../components/templates/InternalTemplate';
import Section from '../../components/blocks/Section';
import TableMenu from '../../components/blocks/TableMenu';
import InputGroup from '../../components/elements/InputGroup';
import H2 from '../../components/elements/H2';
import Button from '../../components/elements/Button';
import Table from '../../components/elements/Table';
import Th from '../../components/elements/Th';
import Td from '../../components/elements/Td';
import Select from '../../components/elements/Select';
import maskApiToken from '../../helpers/maskApiToken';
import phoneNumberFormat from '../../helpers/phoneNumberFormat';

const AccountHome = () => {
  let history = useHistory();
  const dispatch = useContext(NotificationDispatchContext);
  const modalOpen = useContext(ModalStateContext);
  const currentMenu = useContext(CurrentMenuStateContext);
  const setCurrentMenu = useContext(CurrentMenuDispatchContext);

  const jwt = localStorage.getItem('jwt');
  const account_sid = localStorage.getItem('account_sid');

  const [ data,                         setData                         ] = useState({});
  const [ testApplication,              setTestApplication              ] = useState('');
  const [ registrationWebhookUrl,       setRegistrationWebhookUrl       ] = useState('');
  const [ applications,                 setApplications                 ] = useState([]);
  const [ mobileNumberMenuItems,        setMobileNumberMenuItems        ] = useState([]);
  const [ registrationWebhookMenuItems, setRegistrationWebhookMenuItems ] = useState([]);

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

  const changeTestApplication = async (e) => {
    try {
      setTestApplication(e.target.value);

      await axios({
        method: 'put',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Accounts/${account_sid}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data: {
          test_call_application_sid: e.target.value,
        },
      });
    } catch(err) {
      dispatch({
        type: 'ADD',
        level: 'error',
        message: `Error changing test application: ${err.message}`
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
      history.push(`/account/api-keys/${newApiKeySid}/new`);

    } catch(err) {
      dispatch({
        type: 'ADD',
        level: 'error',
        message: `Error creating API key: ${err.message}`
      });
    }
  };

  useEffect(() => {
    document.title = `Account Home | jambonz`;

    const getData = async () => {
      const userResponse = await axios({
        method: 'get',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: '/Users/me',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (userResponse.data.testapp && userResponse.data.testapp.application_sid) {
        setTestApplication(userResponse.data.testapp.application_sid);
      }

      setData(userResponse.data);

      if (userResponse.data.user && userResponse.data.user.phone) {
        setMobileNumberMenuItems([
          {
            name: 'Edit',
            type: 'link',
            url: `/account/mobile-number/edit`,
          },
          {
            name: 'Remove',
            type: 'link',
            url: `/account/mobile-number/remove`,
          },
        ]);
      } else {
        setMobileNumberMenuItems([
          {
            name: 'Add',
            type: 'link',
            url: `/account/mobile-number/add`,
          },
        ]);
      }

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
      const applicationsRespose = await axios({
        method: 'get',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: '/Applications',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const testAppSid = userResponse.data.testapp && userResponse.data.testapp.application_sid;

      const userCreatedApps = applicationsRespose.data;

      let appsToShow = [];

      if (!userCreatedApps.length && !testAppSid) {

        appsToShow = [{
          sid: '',
          name: '-- Requires an application -- ',
        }];

      } else if (!userCreatedApps.length && testAppSid) {

        appsToShow = [{
          sid: testAppSid,
          name: 'Test Application',
        }];

      } else if (userCreatedApps.length && !testAppSid) {

        appsToShow = [
          {
            sid: '',
            name: '-- Choose One --',
          },
          ...userCreatedApps.map(app => ({
            sid: app.application_sid,
            name: app.name,
          })),
        ];

      } else if (userCreatedApps.length && testAppSid) {

        const testAppIsUserCreated = userCreatedApps.some(app => app.application_sid === testAppSid);

        if (testAppIsUserCreated) {
          appsToShow = userCreatedApps.map(app => ({
            sid: app.application_sid,
            name: app.name,
          }));
        } else {
          appsToShow = [
            {
              sid: testAppSid,
              name: 'Test Application',
            },
            ...userCreatedApps.map(app => ({
              sid: app.application_sid,
              name: app.name,
            }))
          ];
        }
      }

      setApplications(appsToShow);
    };

    getData();
  }, [jwt]);

  return (
    <InternalTemplate title="Home">
      {data.account && data.account.show_tutorial_reminder && (
        <Section>
          <H2>Getting Started</H2>
          <p>{data.account.tutorial_completion}</p>
          <InputGroup flexEnd spaced>
            <Button gray>Don't show again</Button>
            <Button as={ReactRouterLink} to="/account/getting-started">Continue →</Button>
          </InputGroup>
        </Section>
      )}

      {data.user && (
        <Section>
          <H2>Test Your Applications</H2>
          <p>Test an application by calling the test number from the mobile number you signed up with</p>
          <Table>
            <tbody>
              <tr>
                <Th scope="row">Test Number</Th>
                <Td colSpan="2">
                  {
                    (!data.user.phone && 'Requires mobile number') ||
                    (data.test_numbers && data.test_numbers[0] && phoneNumberFormat(data.test_numbers[0])) ||
                    'None'
                  }
                </Td>
              </tr>
              <tr>
                <Th scope="row">Your Mobile Number</Th>
                <Td>{(data.user.phone && phoneNumberFormat(data.user.phone)) || 'None'}</Td>
                <Td containsMenuButton>
                  <TableMenu
                    open={currentMenu === 'account-home-mobile-number'}
                    handleCurrentMenu={() => setCurrentMenu('account-home-mobile-number')}
                    disabled={modalOpen}
                    menuItems={mobileNumberMenuItems}
                  />
                </Td>
              </tr>
              <tr>
                <Th scope="row"><label htmlFor="testApplication">Application</label></Th>
                <Td colSpan="2">
                  <Select
                    fullWidth
                    name="testApplication"
                    id="testApplication"
                    value={testApplication}
                    onChange={changeTestApplication}
                  >
                    {applications.length && applications.map(app => (
                      <option key={app.sid} value={app.sid}>{app.name}</option>
                    ))}
                  </Select>
                </Td>
              </tr>
            </tbody>
          </Table>
        </Section>
      )}

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
    </InternalTemplate>
  );
};

export default AccountHome;
