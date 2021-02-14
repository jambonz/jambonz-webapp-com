import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';
import Section from '../../../components/blocks/Section';

const GettingStartedIndex = () => {
  return (
    <InternalTemplate title="Getting Started">
      <Section>
        <Link to="/account/getting-started/test">Getting Started Details</Link>
      </Section>
    </InternalTemplate>
  );
};

export default GettingStartedIndex;
