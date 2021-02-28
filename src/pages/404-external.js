import ExternalMain from '../components/wrappers/ExternalMain';
import Link from '../components/elements/Link';

const InvalidRoute = () => {
  return (
    <ExternalMain title="Invalid Route">
      <p>That page doesn't exist.</p>
      <p><Link to="/">Log In</Link></p>
    </ExternalMain>
  );
};

export default InvalidRoute;
