import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';
import Section from '../../../components/blocks/Section';

const AlertsDetails = () => {
  return (
    <InternalTemplate title="Alert Details">
      <Section>
        <Link to="/account/alerts">← Back to Alerts</Link>
      </Section>
    </InternalTemplate>
  );
};

export default AlertsDetails;
