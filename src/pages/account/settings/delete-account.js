import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';
import Section from '../../../components/blocks/Section';

const SettingsDeleteAccount = () => {
  return (
    <InternalTemplate title="Delete Account">
      <Section>
        <Link to="/account/settings">← Back to Settings</Link>
      </Section>
    </InternalTemplate>
  );
};

export default SettingsDeleteAccount;
