import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';
import Section from '../../../components/blocks/Section';

const SettingsIndex = () => {
  return (
    <InternalTemplate title="Settings">
      <Section>
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
      </Section>
    </InternalTemplate>
  );
};

export default SettingsIndex;
