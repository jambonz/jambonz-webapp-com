import InternalMain from '../../../components/wrappers/InternalMain';
import Link from '../../../components/elements/Link';
import Section from '../../../components/blocks/Section';

const ApiKeyDetails = () => {
  return (
    <InternalMain title="API Key Details">
      <Section>
        <Link to="/account/api-keys/test/delete">Delete API Key</Link>
      </Section>
    </InternalMain>
  );
};

export default ApiKeyDetails;
