import InternalMain from '../../../components/wrappers/InternalMain';
import Link from '../../../components/elements/Link';
import Section from '../../../components/blocks/Section';

const ApiKeyNew = () => {
  return (
    <InternalMain title="New API Key">
      <Section>
        <Link to="/account/api-keys/test/delete">Delete API Key</Link>
      </Section>
    </InternalMain>
  );
};

export default ApiKeyNew;
