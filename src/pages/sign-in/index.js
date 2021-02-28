import { v4 as uuid } from 'uuid';
import ExternalMain from '../../components/wrappers/ExternalMain';
import Link from '../../components/elements/Link';

const SignIn = props => {
  const state = uuid();
  localStorage.setItem('location-before-oauth', '/sign-in');
  localStorage.setItem('oauth-state', state);
  const gitHubUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&state=${state}&scope=user:email&allow_signup=false`;
  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=email+profile+https://www.googleapis.com/auth/cloud-platform&access_type=offline&include_granted_scopes=true&response_type=code&state=${state}&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URI}&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}`;

  return (
    <ExternalMain title="Sign In">
      <p>Sign in with:</p>
      <p><a href={gitHubUrl}>GitHub</a> </p>
      <p><a href={googleUrl}>Google</a> </p>
      <p><Link to="/sign-in/email">Email</Link></p>
      <p><Link to="/register">Register</Link></p>
    </ExternalMain>
  );
};

export default SignIn;
