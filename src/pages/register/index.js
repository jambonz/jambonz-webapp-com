import React, { useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import SetupTemplate from '../../components/templates/SetupTemplate';
import Link from '../../components/elements/Link.js';

const Register = props => {
  useEffect(() => {
    document.title = `Register | Jambonz`;
  });

  const state = uuid();
  localStorage.setItem('location-before-oauth', '/register');
  localStorage.setItem('oauth-state', state);
  const gitHubUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&state=${state}&scope=user:email&allow_signup=false`;
  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=email+profile+https://www.googleapis.com/auth/cloud-platform&access_type=offline&include_granted_scopes=true&response_type=code&state=${state}&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URI}&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}`;

  return (
    <SetupTemplate title="Register">
      <p>Register with:</p>
      <div>
        <a href={gitHubUrl}>GitHub</a>
      </div>
      <div>
        <a href={googleUrl}>Google</a>
      </div>
      <div><Link to="/register/email">Email</Link></div>
    </SetupTemplate>
  );
};

export default Register;
