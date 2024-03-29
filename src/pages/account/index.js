import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import styled from "styled-components/macro";
import { CurrentMenuStateContext, CurrentMenuDispatchContext } from '../../contexts/CurrentMenuContext';
import { NotificationDispatchContext } from '../../contexts/NotificationContext';
import { ModalStateContext } from '../../contexts/ModalContext';
import InternalMain from '../../components/wrappers/InternalMain';
import AccountSetupList from '../../components/blocks/AccountSetupList';
import Section from '../../components/blocks/Section';
import TableMenu from '../../components/blocks/TableMenu';
import Modal from '../../components/blocks/Modal';
import InputGroup from '../../components/elements/InputGroup';
import H2 from '../../components/elements/H2';
import Button from '../../components/elements/Button';
import Table from '../../components/elements/Table';
import Th from '../../components/elements/Th';
import Td from '../../components/elements/Td';
import P from '../../components/elements/P';
import handleErrors from '../../helpers/handleErrors';
import maskApiToken from '../../helpers/maskApiToken';
import Loader from '../../components/blocks/Loader';
import Subscription from '../../components/blocks/Subscription';
import { getPastDays } from "../../utils/parse";
import PlanType from '../../data/PlanType';

const ModalContainer = styled.div`
  margin-top: 2rem;
`;

const HomePageWrapper = styled.div`
  margin-top: -2rem;
`;

const StyledTable = styled(Table)`
  tr {
    display: grid;
    grid-template-columns: 250px 1fr auto;
    align-content: center;
    align-items: center;

    td {
      text-overflow: ellipsis;
    }
  }
  ${props => props.theme.mobileOnly} {
    tr {
      display: grid;
      grid-template-columns: 120px 1fr auto;
      align-content: center;
      align-items: center;

      & > * {
        padding: 0 1rem;
      }

      th {
        white-space: normal;
      }

      td {
        text-overflow: ellipsis;
      }
    }
  }
`;

const StyledAPIKeysTable = styled(Table)`
  ${props => props.theme.mobileOnly} {
    & tr > * {
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }
  }
`;

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
  const [ showLoader,                   setShowLoader                   ] = useState(true);
  const [accountSetupCompleted, setAccountSetupCompleted] = useState(false);
  const [showConfirmSecret, setShowConfirmSecret] = useState(false);
  const [generatingSecret, setGeneratingSecret] = useState(false);
  const [webhookSecret, setWebhookSecret] = useState("");
  const [enabledCardDetailRecord, setEnabledCardDetailRecord] = useState(false);
  const [applicationMenuItems, setApplicationMenuItems] = useState([]);
  const [applicationList, setApplicationList] = useState([]);
  const [webhooks, setWebhooks] = useState([]);

  const [mobile, setMobile] = useState(false);

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

  const confirmGenerateNewSecret = () => {
    setShowConfirmSecret(true);
  };

  const updateWebhookSecret = async () => {
    try {
      const { account_sid } = data.account || {};

      if (account_sid) {
        setGeneratingSecret(true);
        const apiKeyResponse = await axios({
          method: 'get',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: `/Accounts/${account_sid}/WebhookSecret?regenerate=true`,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (apiKeyResponse.status === 200) {
          setWebhookSecret(apiKeyResponse.data.webhook_secret);
          dispatch({
            type: 'ADD',
            level: 'success',
            message: 'Webhook signing secret was successfully generated.',
          });
        }
      }
    } catch (err) {
      handleErrors({ err, history, dispatch });
    } finally {
      setGeneratingSecret(false);
      setShowConfirmSecret(false);
    }
  };

  const enableCardDetailRecords = async () => {
    try {
      const apiKeyResponse = await axios({
        method: 'put',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Accounts/${account_sid}`,
        data: {
          disable_cdrs: enabledCardDetailRecord ? 1 : 0,
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (apiKeyResponse.status === 204) {
        setEnabledCardDetailRecord(!enabledCardDetailRecord);
      }
    } catch (err) {
      handleErrors({ err, history, dispatch });
    }
  };

  const screenSizeChanged = () => {
    const { width } = window.screen;
    const breakPoint = 977;
    setMobile(width < breakPoint);
  };

  const getApplicationName = (data) => {
    let res = 'Not specified';

    if (data && data.account) {
      const { device_calling_application_sid } = data.account;

      const app = (applicationList || []).find((item) => item.application_sid === device_calling_application_sid);
      if (app) {
        res = app.name;
      }
    }

    return res;
  };

  const resetDeviceCallingApplication = async () => {
    let isMounted = true;

    try {
      setShowLoader(true);

      await axios({
        method: "put",
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/Accounts/${account_sid}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data: {
          device_calling_application_sid: null,
        },
      });

      const userResponse = await axios({
        method: 'get',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: '/Users/me',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      setData(userResponse.data);
      setApplicationMenuItems([
        {
          name: 'Add',
          type: 'link',
          url: `/account/device-application/add`,
        },
      ]);
    } catch (err) {
      dispatch({
        type: 'ADD',
        level: 'error',
        message: `Unable to delete device calling application.`,
      });
    } finally {
      if (isMounted) {
        setShowLoader(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    const getData = async () => {
      try {
        const appResult = await axios({
          method: "get",
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: "/Applications",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (appResult && appResult.data) {
          setApplicationList(appResult.data);
        }

        const userResponse = await axios({
          method: 'get',
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: '/Users/me',
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        setData(userResponse.data);
        setWebhookSecret((userResponse.data.account || {}).webhook_secret);
        setEnabledCardDetailRecord(!(userResponse.data.account || {}).disable_cdrs);

        setWebhooks(await Promise.all(['registration_hook_sid', 'queue_event_hook_sid'].map(async (webhookProp) => {
          const webhookKey = webhookProp.replace('_hook_sid', '').replace(/_/g, '-');
          const webhookMap = {
            key: webhookKey,
            url: '',
            items: [],
            label: webhookKey.split('-').map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' '),
          };

          if (userResponse.data.account && userResponse.data.account[webhookProp]) {
            const webhookSid = userResponse.data.account[webhookProp];
            const response = await axios({
              method: 'get',
              baseURL: process.env.REACT_APP_API_BASE_URL,
              url: `/Webhooks/${webhookSid}`,
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            });

            if (response.data && response.data.url) {
              webhookMap.url = response.data.url;
            }

            webhookMap.items = [
              {
                name: 'Edit',
                type: 'link',
                url: `/account/${webhookKey}-webhook/${webhookSid}/edit`,
              },
              {
                name: 'Delete',
                type: 'link',
                url: `/account/${webhookKey}-webhook/${webhookSid}/delete`,
              },
            ];
          } else {
            webhookMap.items = [
              {
                name: 'Add',
                type: 'link',
                url: `/account/${webhookKey}-webhook/add`,
              },
            ];
          }

          return webhookMap;
        })));

        if (userResponse.data && userResponse.data.account && userResponse.data.account.device_calling_application_sid) {
          const { device_calling_application_sid } = userResponse.data.account;
          setApplicationMenuItems([
            {
              name: 'Edit',
              type: 'link',
              url: `/account/device-application/${device_calling_application_sid}/edit`,
            },
            {
              name: 'Delete',
              type: 'Button',
              action: resetDeviceCallingApplication,
            },
          ]);
        } else {
          setApplicationMenuItems([
            {
              name: 'Add',
              type: 'link',
              url: `/account/device-application/add`,
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

    window.addEventListener('resize', screenSizeChanged);

    screenSizeChanged();

    return () => {
      isMounted = false;

      window.removeEventListener('resize', screenSizeChanged);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <InternalMain metaTitle="Account Home">
      {showLoader ? (
        <Loader height="calc(100vh - 24rem)" />
      ) : (
        <HomePageWrapper>
          {(data.account || {}).plan_type !== PlanType.PAID && (
            <Section>
              <Subscription data={data} />
            </Section>
          )}

          {!accountSetupCompleted && (
            <Section>
              <H2 bold>Finish Account Setup</H2>
              <AccountSetupList onComplete={setAccountSetupCompleted}/>
            </Section>
          )}

          {data.account && (
            <Section>
              <H2 bold>Account</H2>
              <StyledTable>
                <tbody>
                  <tr>
                    <Th scope="row" color="#da1c5c">SIP Realm</Th>
                    <Td overflow="hidden">{data.account.sip_realm}</Td>
                    <Td containsMenuButton>
                      <TableMenu
                        open={currentMenu === 'account-home-sip-realm'}
                        handleCurrentMenu={() => setCurrentMenu('account-home-sip-realm')}
                        disabled={modalOpen}
                        menuItems={[
                          {
                            name: 'Change SIP Realm',
                            type: 'link',
                            url: `/account/sip-realm/edit`,
                          },
                        ]}
                      />
                    </Td>
                  </tr>
                  <tr>
                    <Th scope="row" color="#da1c5c">Account SID</Th>
                    <Td overflow="hidden">{data.account.account_sid}</Td>
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
                  {webhooks.map((webhook) => {
                    return (
                      <tr key={webhook.key}>
                        <Th scope="row" color="#da1c5c">{webhook.label} Webhook</Th>
                        <Td overflow="hidden">{webhook.url || 'None'}</Td>
                        <Td containsMenuButton>
                          <TableMenu
                            open={currentMenu === `account-home-${webhook.key}-webhook`}
                            handleCurrentMenu={() => setCurrentMenu(`account-home-${webhook.key}-webhook`)}
                            disabled={modalOpen}
                            menuItems={webhook.items}
                          />
                        </Td>
                      </tr>
                    );
                  })}
                  <tr>
                    <Th scope="row" color="#da1c5c">Device calling application</Th>
                    <Td overflow="hidden">
                      {getApplicationName(data)}
                    </Td>
                    <Td containsMenuButton>
                      <TableMenu
                        open={currentMenu === 'account-home-registration-application'}
                        handleCurrentMenu={() => setCurrentMenu('account-home-registration-application')}
                        disabled={modalOpen}
                        menuItems={applicationMenuItems}
                      />
                    </Td>
                  </tr>
                  <tr>
                    <Th scope="row" color="#da1c5c">Webhook signing secret</Th>
                    <Td overflow="hidden">{webhookSecret}</Td>
                    <Td containsMenuButton>
                      <TableMenu
                        open={currentMenu === 'account-home-webhook-signing-secret'}
                        handleCurrentMenu={() => setCurrentMenu('account-home-webhook-signing-secret')}
                        disabled={modalOpen}
                        menuItems={[
                          {
                            name: 'Copy',
                            type: 'button',
                            action: () => copyText({
                              text: webhookSecret,
                              textType: 'Webhook signing secret',
                            }),
                          },
                          {
                            name: 'Generate new secret',
                            type: 'button',
                            action: () => {
                              confirmGenerateNewSecret();
                            },
                          }
                        ]}
                      />
                    </Td>
                  </tr>
                  <tr>
                    <Th scope="row" color="#da1c5c">Call Detail Records</Th>
                    <Td overflow="hidden">{enabledCardDetailRecord ? 'Enabled' : 'Disabled'}</Td>
                    <Td containsMenuButton>
                      <TableMenu
                        open={currentMenu === 'account-home-call-detail-records'}
                        handleCurrentMenu={() => setCurrentMenu('account-home-call-detail-records')}
                        disabled={modalOpen}
                        menuItems={[
                          {
                            name: `${enabledCardDetailRecord ? 'Disable' : 'Enable'} Call Detail Records`,
                            type: 'button',
                            action: () => {
                              enableCardDetailRecords();
                            },
                          }
                        ]}
                      />
                    </Td>
                  </tr>
                </tbody>
              </StyledTable>
            </Section>
          )}

          {showConfirmSecret && (
            <Modal
              title={generatingSecret ? "" : "Generate new secret"}
              loader={generatingSecret}
              hideButtons={generatingSecret}
              maskClosable={!generatingSecret}
              actionText="OK"
              content={
                <ModalContainer>
                  <P>Press OK to generate a new webhook signing secret.</P>
                  <P>Note: this will immediately invalidate the old webhook signing secret.</P>
                </ModalContainer>
              }
              handleCancel={() => setShowConfirmSecret(false)}
              handleSubmit={updateWebhookSecret}
            />
          )}

          {data.api_keys && (
            <Section>
              <StyledAPIKeysTable sectionTableWithHeader>
                <thead>
                  <tr>
                    <Th sectionTableWithHeader color="#da1c5c">
                      <H2 inTable bold>API Keys</H2>
                    </Th>
                    <Th sectionTableWithHeader color="#da1c5c" bold>
                      {data.api_keys.length ? 'Last Used' : ''}
                    </Th>
                    <Th sectionTableWithHeader containsSquareButton color="#da1c5c">
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
                        <Th scope="row" color="#da1c5c">
                          <p style={{ marginBottom: 0 }}>
                            {maskApiToken(apiKey.token, mobile)}
                          </p>
                        </Th>
                        <Td>{getPastDays(apiKey.last_used)}</Td>
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
              </StyledAPIKeysTable>
            </Section>
          )}

          {data.products && data.balance && (
            <Section>
              <H2>Capacity and Balance</H2>
              <Table>
                <tbody>
                  <tr>
                    <Th scope="row" color="#da1c5c">Max simultaneous calls</Th>
                    <Td textAlign="right">{data.products.find(product => product.category === 'devices').quantity}</Td>
                  </tr>
                  <tr>
                    <Th scope="row" color="#da1c5c">Max simultaneous registered devices</Th>
                    <Td textAlign="right">{data.products.find(product => product.category === 'calls').quantity}</Td>
                  </tr>
                  <tr>
                    <Th scope="row" color="#da1c5c">Prepaid balance</Th>
                    <Td textAlign="right">{data.balance.balance ? `$${data.balance.balance}` : ''}</Td>
                  </tr>
                </tbody>
              </Table>
              <InputGroup flexEnd>
                <Button gray disabled>Add Capacity of Funds (coming soon)</Button>
              </InputGroup>
            </Section>
          )}
        </HomePageWrapper>
      )}
    </InternalMain>
  );
};

export default AccountHome;
