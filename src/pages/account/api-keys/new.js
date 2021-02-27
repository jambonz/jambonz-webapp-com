import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link';
import Section from '../../../components/blocks/Section';

const ApiKeyNew = () => {
  return (
    <InternalTemplate title="New API Key">
      <Section>
        <Link to="/account/api-keys/test/delete">Delete API Key</Link>
      </Section>
    </InternalTemplate>
  );
};

export default ApiKeyNew;
