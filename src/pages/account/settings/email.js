import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';
import Section from '../../../components/blocks/Section';

const SettingsChangeEmail = () => {
  return (
    <InternalTemplate
      title="Change Email"
      breadcrumbs={[
        { name: 'Back to Settings', url: '/account/settings' },
      ]}
    >
      <Section>
        <Link to="/account/settings">← Back to Settings</Link>
      </Section>
    </InternalTemplate>
  );
};

export default SettingsChangeEmail;
