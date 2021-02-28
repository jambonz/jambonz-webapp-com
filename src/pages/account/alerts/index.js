import InternalMain from '../../../components/wrappers/InternalMain';
import Link from '../../../components/elements/Link';
import Section from '../../../components/blocks/Section';

const AlertsIndex = () => {
  return (
    <InternalMain title="Alerts">
      <Section>
        <Link to="/account/alerts/test">Alert Details</Link>
      </Section>
    </InternalMain>
  );
};

export default AlertsIndex;
