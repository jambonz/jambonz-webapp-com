import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';

const ApiKeyDelete = () => {
  return (
    <InternalTemplate title="Delete API Key">
      <Link to="/account/api-keys/test">Go to API Key Details</Link>
    </InternalTemplate>
  );
};

export default ApiKeyDelete;
