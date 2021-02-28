import InternalMain from '../../../components/blocks/InternalMain';
import Link from '../../../components/elements/Link';
import Section from '../../../components/blocks/Section';

const SettingsChangeEmail = () => {
  return (
    <InternalMain
      title="Change Email"
      breadcrumbs={[
        { name: 'Back to Settings', url: '/account/settings' },
      ]}
    >
      <Section>
        <Link to="/account/settings">← Back to Settings</Link>
      </Section>
    </InternalMain>
  );
};

export default SettingsChangeEmail;
