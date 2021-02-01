import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';

const SettingsIndex = () => {
  return (
    <InternalTemplate title="Settings">
      <div>
        <Link to="/account/settings/auth">Change Authentication Method</Link>
      </div>
      <div>
        <Link to="/account/settings/change-name-and-email">Change Name and Email</Link>
      </div>
      <div>
        <Link to="/account/settings/change-password">Change Password</Link>
      </div>
      <div>
        <Link to="/account/settings/delete-account">Delete Account</Link>
      </div>
    </InternalTemplate>
  );
};

export default SettingsIndex;
