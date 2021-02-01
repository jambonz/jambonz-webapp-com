import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';

const SettingsChangePassword = () => {
  return (
    <InternalTemplate title="Change Password">
      <Link to="/account/settings">← Back to Settings</Link>
    </InternalTemplate>
  );
};

export default SettingsChangePassword;
