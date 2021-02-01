import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';

const SettingsDeleteAccount = () => {
  return (
    <InternalTemplate title="Delete Account">
      <Link to="/account/settings">← Back to Settings</Link>
    </InternalTemplate>
  );
};

export default SettingsDeleteAccount;
