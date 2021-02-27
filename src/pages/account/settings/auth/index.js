import InternalTemplate from '../../../../components/templates/InternalTemplate';
import Link from '../../../../components/elements/Link';
import Section from '../../../../components/blocks/Section';

const SettingsAuthIndex = () => {
  return (
    <InternalTemplate title="Authentication Method">
      <Section>
        <Link to="/account/settings">← Back to Settings</Link>
      </Section>
    </InternalTemplate>
  );
};

export default SettingsAuthIndex;
