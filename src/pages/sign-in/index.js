import { v4 as uuid } from 'uuid';
import styled from "styled-components/macro";
import ExternalMain from '../../components/wrappers/ExternalMain';
import Link from '../../components/elements/Link';

const H3 = styled.h3`
  font-family: Objectivity;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: -0.02px;
  text-align: left;
  color: #231f20;
  margin-bottom: 1rem;
  max-width: 28rem;
`;

const ALink = styled.a`
  font-family: Objectivity;
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.02px;
  text-align: center;
  color: #da1c5c;
  text-decoration: none;

  &:hover {
    color: #da1c5c;
    text-decoration: none;
    box-shadow: 0 0.125rem 0;
    border-radius: 0;
    color: #d91c5c;
  }

  &:hover > span {
  }
`;

const SignIn = props => {
  const state = uuid();
  localStorage.setItem('location-before-oauth', '/sign-in');
  localStorage.setItem('oauth-state', state);
  const gitHubUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&state=${state}&scope=user:email&allow_signup=false`;
  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=email+profile+https://www.googleapis.com/auth/cloud-platform&access_type=offline&include_granted_scopes=true&response_type=code&state=${state}&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URI}&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}`;

  return (
    <ExternalMain title="Sign In">
      <H3>Sign in with:</H3>
      <H3><ALink href={gitHubUrl}>GitHub</ALink> </H3>
      <H3><ALink href={googleUrl}>Google</ALink> </H3>
      <H3><Link to="/sign-in/email">Email</Link></H3>
      <H3><Link to="/register">Register</Link></H3>
    </ExternalMain>
  );
};

export default SignIn;
