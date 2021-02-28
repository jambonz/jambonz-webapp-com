import InternalMain from '../../../components/wrappers/InternalMain';
import Link from '../../../components/elements/Link';
import Section from '../../../components/blocks/Section';

const SettingsVerifyYourEmail = () => {
  return (
    <InternalMain title="Verify Your Email">
      <Section>
        <Link to="/account/settings">← Back to Settings</Link>
      </Section>
    </InternalMain>
  );
};

export default SettingsVerifyYourEmail;
