import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { NotificationStateContext } from './contexts/NotificationContext';

import SignIn from './pages/sign-in/index.js';
import SignInEmail from './pages/sign-in/email.js';
import Register from './pages/register/index.js';
import RegisterWithEmail from './pages/register/email.js';
import RegisterWithEmailVerify from './pages/register/email-verify.js';
import RegisterChooseSubdomain from './pages/register/subdomain.js';
import RegisterMobileNumber from './pages/register/mobile-number.js';
import RegisterMobileNumberVerify from './pages/register/mobile-number-verify.js';
import RegisterComplete from './pages/register/complete.js';
import OauthCallbackGitHub from './pages/oauth-callback/github.js';
import OauthCallbackGoogle from './pages/oauth-callback/google.js';
import AccountHome from './pages/account/index.js';
import ApiKeysDetails from './pages/account/api-keys/details.js';
import ApiKeysNew from './pages/account/api-keys/new.js';
import ApiKeysDelete from './pages/account/api-keys/delete.js';
import MobileNumberEdit from './pages/account/mobile-number/edit.js';
import MobileNumberVerify from './pages/account/mobile-number/verify.js';
import MobileNumberRemove from './pages/account/mobile-number/remove.js';
import RegistrationWebhookEdit from './pages/account/registration-webhook/edit.js';
import SipRealmEdit from './pages/account/sip-realm/edit.js';
import ApplicationsIndex from './pages/account/applications/index.js';
import ApplicationsAddEdit from './pages/account/applications/add-edit.js';
import RecentCallsIndex from './pages/account/recent-calls/index.js';
import AlertsIndex from './pages/account/alerts/index.js';
import AlertsDetails from './pages/account/alerts/details.js';
import CarriersIndex from './pages/account/carriers/index.js';
import CarriersAddEdit from './pages/account/carriers/add-edit.js';
import PhoneNumbersIndex from './pages/account/phone-numbers/index.js';
import PhoneNumbersAddEdit from './pages/account/phone-numbers/add-edit.js';
import SpeechServicesIndex from './pages/account/speech-services/index.js';
import SpeechServicesAddEdit from './pages/account/speech-services/add-edit.js';
import AddOnsIndex from './pages/account/add-ons/index.js';
import AddOnsAddRemove from './pages/account/add-ons/add-remove.js';
import GettingStartedIndex from './pages/account/getting-started/index.js';
import GettingStartedDetails from './pages/account/getting-started/details.js';
import SettingsIndex from './pages/account/settings/index.js';
import SettingsChangeNameAndEmail from './pages/account/settings/change-name-and-email.js';
import SettingsChangePassword from './pages/account/settings/change-password.js';
import SettingsDeleteAccount from './pages/account/settings/delete-account.js';
import SettingsVerifyYourEmail from './pages/account/settings/verify-your-email.js';
import SettingsAuthIndex from './pages/account/settings/auth/index.js';
import SettingsAuthEmail from './pages/account/settings/auth/email.js';
import InvalidRouteInternal from './pages/404-internal';
import InvalidRouteExternal from './pages/404-external';

import Notification from './components/blocks/Notification';
import Nav from './components/blocks/Nav';
import SideMenu from './components/blocks/SideMenu';

function App() {
  const notifications = useContext(NotificationStateContext);
  return (
    <Router>
      <Notification notifications={notifications} />
      <Nav />
      <Switch>

        {/***********/}
        {/* Sign in */}
        {/***********/}
        <Route exact path="/"><Redirect to="/sign-in" /></Route>
        <Route exact path="/sign-in"><SignIn /></Route>
        <Route exact path="/sign-in/email"><SignInEmail /></Route>

        {/****************/}
        {/* Registration */}
        {/****************/}
        <Route exact path="/register"><Register /></Route>
        <Route exact path="/register/email"><RegisterWithEmail /></Route>
        <Route exact path="/register/verify-your-email"><RegisterWithEmailVerify /></Route>
        <Route exact path="/register/choose-a-subdomain"><RegisterChooseSubdomain /></Route>
        <Route exact path="/register/mobile-number"><RegisterMobileNumber /></Route>
        <Route exact path="/register/verify-your-mobile-number"><RegisterMobileNumberVerify /></Route>
        <Route exact path="/register/complete"><RegisterComplete /></Route>

        {/******************/}
        {/* OAuth Callback */}
        {/******************/}
        <Route exact path="/oauth-callback/github"><OauthCallbackGitHub /></Route>
        <Route exact path="/oauth-callback/google"><OauthCallbackGoogle /></Route>

        {/*******************/}
        {/* INTERNAL ROUTES */}
        {/*******************/}
        <Route path="/account">
          <div style={{ display: "flex" }}>
            <SideMenu />
            <Switch>
              <Route exact path="/account"><AccountHome /></Route>

              <Route exact path="/account/api-keys/:id"><ApiKeysDetails /></Route>
              <Route exact path="/account/api-keys/:id/new"><ApiKeysNew /></Route>
              <Route exact path="/account/api-keys/:id/delete"><ApiKeysDelete /></Route>

              <Route exact path="/account/mobile-number/edit"><MobileNumberEdit /></Route>
              <Route exact path="/account/mobile-number/verify"><MobileNumberVerify /></Route>
              <Route exact path="/account/mobile-number/remove"><MobileNumberRemove /></Route>

              <Route exact path="/account/registration-webhook/edit"><RegistrationWebhookEdit /></Route>

              <Route exact path="/account/sip-realm/edit"><SipRealmEdit /></Route>

              <Route exact path="/account/applications"><ApplicationsIndex /></Route>
              <Route exact path={[
                "/account/applications/add",
                "/account/applications/:application_sid/edit",
              ]}>
                <ApplicationsAddEdit />
              </Route>

              <Route exact path="/account/recent-calls"><RecentCallsIndex /></Route>

              <Route exact path="/account/alerts"><AlertsIndex /></Route>
              <Route exact path="/account/alerts/:id"><AlertsDetails /></Route>

              <Route exact path="/account/carriers"><CarriersIndex /></Route>
              <Route exact path={[
                "/account/carriers/add",
                "/account/carriers/:voip_carrier_sid/edit",
              ]}>
                <CarriersAddEdit />
              </Route>

              <Route exact path="/account/phone-numbers"><PhoneNumbersIndex /></Route>
              <Route exact path={[
                "/account/phone-numbers/add",
                "/account/phone-numbers/:phone_number_sid/edit",
              ]}>
                <PhoneNumbersAddEdit />
              </Route>

              <Route exact path="/account/speech-services"><SpeechServicesIndex /></Route>
              <Route exact path={[
                "/account/speech-services/add",
                "/account/speech-services/:id/edit",
              ]}>
                <SpeechServicesAddEdit />
              </Route>

              <Route exact path="/account/add-ons"><AddOnsIndex /></Route>
              <Route exact path={[
                "/account/add-ons/:slug/add",
                "/account/add-ons/:slug/remove",
              ]}>
                <AddOnsAddRemove />
              </Route>

              <Route exact path="/account/getting-started"><GettingStartedIndex /></Route>
              <Route exact path="/account/getting-started/:slug"><GettingStartedDetails /></Route>

              <Route exact path="/account/settings"><SettingsIndex /></Route>
              <Route exact path="/account/settings/change-name-and-email"><SettingsChangeNameAndEmail /></Route>
              <Route exact path="/account/settings/change-password"><SettingsChangePassword /></Route>
              <Route exact path="/account/settings/delete-account"><SettingsDeleteAccount /></Route>
              <Route exact path="/account/settings/verify-your-email"><SettingsVerifyYourEmail /></Route>
              <Route exact path="/account/settings/auth"><SettingsAuthIndex /></Route>
              <Route exact path="/account/settings/auth/email"><SettingsAuthEmail /></Route>

              {/****************/}
              {/* Internal 404 */}
              {/****************/}
              <Route path="/account"><InvalidRouteInternal /></Route>
            </Switch>
          </div>
        </Route>

        {/****************/}
        {/* External 404 */}
        {/****************/}
        <Route><InvalidRouteExternal /></Route>
      </Switch>
    </Router>
  );
}

export default App;
