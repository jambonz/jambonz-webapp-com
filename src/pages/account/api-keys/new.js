import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';

const ApiKeyNew = () => {
  return (
    <InternalTemplate title="New API Key">
      <Link to="/account/api-keys/test/delete">Delete API Key</Link>
    </InternalTemplate>
  );
};

export default ApiKeyNew;
