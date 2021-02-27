import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link';
import Section from '../../../components/blocks/Section';

const ApiKeyDetails = () => {
  return (
    <InternalTemplate title="API Key Details">
      <Section>
        <Link to="/account/api-keys/test/delete">Delete API Key</Link>
      </Section>
    </InternalTemplate>
  );
};

export default ApiKeyDetails;
