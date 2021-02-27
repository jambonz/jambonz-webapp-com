import { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { NotificationStateContext } from './contexts/NotificationContext';

//===============================================
// Page Imports
//===============================================
import SignIn from './pages/sign-in/index';
import SignInEmail from './pages/sign-in/email';
import Register from './pages/register/index';
import RegisterWithEmail from './pages/register/email';
import RegisterWithEmailVerify from './pages/register/email-verify';
import RegisterChooseSubdomain from './pages/register/subdomain';
import RegisterMobileNumber from './pages/register/mobile-number';
import RegisterMobileNumberVerify from './pages/register/mobile-number-verify';
import RegisterComplete from './pages/register/complete';
import OauthCallback from './pages/oauth-callback/index';
import AccountHome from './pages/account/index';
import ApiKeysDetails from './pages/account/api-keys/details';
import ApiKeysNew from './pages/account/api-keys/new';
import ApiKeysDelete from './pages/account/api-keys/delete';
import MobileNumberAddEdit from './pages/account/mobile-number/add-edit';
import MobileNumberVerify from './pages/account/mobile-number/verify';
import MobileNumberRemove from './pages/account/mobile-number/remove';
import RegistrationWebhookAddEdit from './pages/account/registration-webhook/add-edit';
import RegistrationWebhookDelete from './pages/account/registration-webhook/delete';
import SipRealmEdit from './pages/account/sip-realm/edit';
import ApplicationsIndex from './pages/account/applications/index';
import ApplicationsAddEdit from './pages/account/applications/add-edit';
import RecentCallsIndex from './pages/account/recent-calls/index';
import RecentCallsDetails from './pages/account/recent-calls/details';
import AlertsIndex from './pages/account/alerts/index';
import AlertsDetails from './pages/account/alerts/details';
import CarriersIndex from './pages/account/carriers/index';
import CarriersAddEdit from './pages/account/carriers/add-edit';
import PhoneNumbersIndex from './pages/account/phone-numbers/index';
import PhoneNumbersAddEdit from './pages/account/phone-numbers/add-edit';
import SpeechServicesIndex from './pages/account/speech-services/index';
import SpeechServicesAddEdit from './pages/account/speech-services/add-edit';
import AddOnsIndex from './pages/account/add-ons/index';
import AddOnsAddRemove from './pages/account/add-ons/add-remove';
import GettingStartedIndex from './pages/account/getting-started/index';
import GettingStartedDetails from './pages/account/getting-started/details';
import SettingsIndex from './pages/account/settings/index';
import SettingsName from './pages/account/settings/name';
import SettingsEmail from './pages/account/settings/email';
import SettingsPassword from './pages/account/settings/password';
import SettingsDeleteAccount from './pages/account/settings/delete-account';
import SettingsVerifyYourEmail from './pages/account/settings/verify-your-email';
import SettingsAuthIndex from './pages/account/settings/auth/index';
import SettingsAuthEmail from './pages/account/settings/auth/email';
import InvalidRouteInternal from './pages/404-internal';
import InvalidRouteExternal from './pages/404-external';

//===============================================
// Component Imports
//===============================================
import Notification from './components/blocks/Notification';

//===============================================
// Routes Component
//===============================================
function Routes() {
  const notifications = useContext(NotificationStateContext);
  return (
    <Router>
      <Notification notifications={notifications} />
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
        <Route exact path="/oauth-callback/:provider"><OauthCallback /></Route>

        {/*******************/}
        {/* INTERNAL ROUTES */}
        {/*******************/}
        <Route path="/account">
            <Switch>
              <Route exact path="/account"><AccountHome /></Route>

              <Route exact path="/account/api-keys/:id"><ApiKeysDetails /></Route>
              <Route exact path="/account/api-keys/:id/new"><ApiKeysNew /></Route>
              <Route exact path="/account/api-keys/:id/delete"><ApiKeysDelete /></Route>

              <Route exact path="/account/mobile-number/add"><MobileNumberAddEdit /></Route>
              <Route exact path="/account/mobile-number/edit"><MobileNumberAddEdit /></Route>
              <Route exact path="/account/mobile-number/verify"><MobileNumberVerify /></Route>
              <Route exact path="/account/mobile-number/remove"><MobileNumberRemove /></Route>

              <Route exact path="/account/registration-webhook/add"><RegistrationWebhookAddEdit /></Route>
              <Route exact path="/account/registration-webhook/:webhook_sid/edit"><RegistrationWebhookAddEdit /></Route>
              <Route exact path="/account/registration-webhook/:webhook_sid/delete"><RegistrationWebhookDelete /></Route>

              <Route exact path="/account/sip-realm/edit"><SipRealmEdit /></Route>

              <Route exact path="/account/applications"><ApplicationsIndex /></Route>
              <Route exact path="/account/applications/add"><ApplicationsAddEdit /></Route>
              <Route exact path="/account/applications/:application_sid/edit"><ApplicationsAddEdit /></Route>

              <Route exact path="/account/recent-calls"><RecentCallsIndex /></Route>
              <Route exact path="/account/recent-calls/:id"><RecentCallsDetails /></Route>

              <Route exact path="/account/alerts"><AlertsIndex /></Route>
              <Route exact path="/account/alerts/:id"><AlertsDetails /></Route>

              <Route exact path="/account/carriers"><CarriersIndex /></Route>
              <Route exact path="/account/carriers/add"><CarriersAddEdit /></Route>

              <Route exact path="/account/carriers"><CarriersIndex /></Route>
              <Route exact path="/account/carriers/:voip_carrier_sid/edit"><CarriersAddEdit /></Route>

              <Route exact path="/account/phone-numbers"><PhoneNumbersIndex /></Route>
              <Route exact path="/account/phone-numbers/add"><PhoneNumbersAddEdit /></Route>
              <Route exact path="/account/phone-numbers/:phone_number_sid/edit"><PhoneNumbersAddEdit /></Route>

              <Route exact path="/account/speech-services"><SpeechServicesIndex /></Route>
              <Route exact path="/account/speech-services/add"><SpeechServicesAddEdit /></Route>
              <Route exact path="/account/speech-services/:speech_credential_sid/edit"><SpeechServicesAddEdit /></Route>

              <Route exact path="/account/add-ons"><AddOnsIndex /></Route>
              <Route exact path="/account/add-ons/:slug/add"><AddOnsAddRemove /></Route>
              <Route exact path="/account/add-ons/:slug/remove"><AddOnsAddRemove /></Route>

              <Route exact path="/account/getting-started"><GettingStartedIndex /></Route>
              <Route exact path="/account/getting-started/:slug"><GettingStartedDetails /></Route>

              <Route exact path="/account/settings"><SettingsIndex /></Route>
              <Route exact path="/account/settings/name"><SettingsName /></Route>
              <Route exact path="/account/settings/email"><SettingsEmail /></Route>
              <Route exact path="/account/settings/password"><SettingsPassword /></Route>
              <Route exact path="/account/settings/delete-account"><SettingsDeleteAccount /></Route>
              <Route exact path="/account/settings/verify-your-email"><SettingsVerifyYourEmail /></Route>
              <Route exact path="/account/settings/auth"><SettingsAuthIndex /></Route>
              <Route exact path="/account/settings/auth/email"><SettingsAuthEmail /></Route>

              {/****************/}
              {/* Internal 404 */}
              {/****************/}
              <Route path="/account"><InvalidRouteInternal /></Route>
            </Switch>
        </Route>

        {/****************/}
        {/* External 404 */}
        {/****************/}
        <Route><InvalidRouteExternal /></Route>
      </Switch>
    </Router>
  );
}

export default Routes;
