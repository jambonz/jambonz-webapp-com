import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';

const SettingsVerifyYourEmail = () => {
  return (
    <InternalTemplate title="Verify Your Email">
      <Link to="/account/settings">← Back to Settings</Link>
    </InternalTemplate>
  );
};

export default SettingsVerifyYourEmail;
