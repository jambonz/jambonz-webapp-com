import InternalMain from '../../../components/blocks/InternalMain';
import Link from '../../../components/elements/Link';
import Section from '../../../components/blocks/Section';

const AlertsDetails = () => {
  return (
    <InternalMain title="Alert Details">
      <Section>
        <Link to="/account/alerts">← Back to Alerts</Link>
      </Section>
    </InternalMain>
  );
};

export default AlertsDetails;
