import React, { useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import ExternalTemplate from '../../components/templates/ExternalTemplate';
import Link from '../../components/elements/Link.js';

const SignIn = props => {
  useEffect(() => {
    document.title = `Sign In | jambonz`;
  });

  const state = uuid();
  localStorage.setItem('location-before-oauth', '/sign-in');
  localStorage.setItem('oauth-state', state);
  const gitHubUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&state=${state}&scope=user:email&allow_signup=false`;
  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=email+profile+https://www.googleapis.com/auth/cloud-platform&access_type=offline&include_granted_scopes=true&response_type=code&state=${state}&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URI}&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}`;

  return (
    <ExternalTemplate title="Sign In">
      <p>Sign in with:</p>
      <div>
        <a href={gitHubUrl}>GitHub</a>
      </div>
      <div>
        <a href={googleUrl}>Google</a>
      </div>
      <div><Link to="/sign-in/email">Email</Link></div>
      <Link to="/register">Register</Link>
    </ExternalTemplate>
  );
};

export default SignIn;
