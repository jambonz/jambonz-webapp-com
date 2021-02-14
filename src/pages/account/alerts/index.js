import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';
import Section from '../../../components/blocks/Section';

const AlertsIndex = () => {
  return (
    <InternalTemplate title="Alerts">
      <Section>
        <Link to="/account/alerts/test">Alert Details</Link>
      </Section>
    </InternalTemplate>
  );
};

export default AlertsIndex;
