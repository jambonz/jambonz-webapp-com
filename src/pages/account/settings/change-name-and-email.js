import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';
import Section from '../../../components/blocks/Section';

const SettingsChangeNameAndEmail = () => {
  return (
    <InternalTemplate title="Change Name and Email">
      <Section>
        <Link to="/account/settings">← Back to Settings</Link>
      </Section>
    </InternalTemplate>
  );
};

export default SettingsChangeNameAndEmail;
