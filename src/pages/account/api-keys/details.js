import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';

const ApiKeyDetails = () => {
  return (
    <InternalTemplate title="API Key Details">
      <Link to="/account/api-keys/test/delete">Delete API Key</Link>
    </InternalTemplate>
  );
};

export default ApiKeyDetails;
