import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link';
import Section from '../../../components/blocks/Section';

const GettingStartedDetails = () => {
  return (
    <InternalTemplate title="Getting Started Details">
      <Section>
        <Link to="/account/getting-started">← Back to Getting Started</Link>
      </Section>
    </InternalTemplate>
  );
};

export default GettingStartedDetails;
