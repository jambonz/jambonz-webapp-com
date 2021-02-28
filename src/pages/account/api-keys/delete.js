import InternalMain from '../../../components/blocks/InternalMain';
import Link from '../../../components/elements/Link';
import Section from '../../../components/blocks/Section';

const ApiKeyDelete = () => {
  return (
    <InternalMain title="Delete API Key">
      <Section>
        <Link to="/account/api-keys/test">Go to API Key Details</Link>
      </Section>
    </InternalMain>
  );
};

export default ApiKeyDelete;
