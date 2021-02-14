import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';
import Section from '../../../components/blocks/Section';

const ApiKeyDelete = () => {
  return (
    <InternalTemplate title="Delete API Key">
      <Section>
        <Link to="/account/api-keys/test">Go to API Key Details</Link>
      </Section>
    </InternalTemplate>
  );
};

export default ApiKeyDelete;
