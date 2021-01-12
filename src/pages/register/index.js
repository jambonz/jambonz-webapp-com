import React, { useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import SetupTemplate from '../../components/templates/SetupTemplate';
const Register = props => {
  useEffect(() => {
    document.title = `Register | Jambonz`;
  });

  const state = uuid();
  localStorage.setItem('location-before-oauth', '/register');
  localStorage.setItem('oauth-github-state', state);
  const gitHubUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&state=${state}&scope=user:email&allow_signup=false`;

  return (
    <SetupTemplate title="Register">
      <p>Register with:</p>
      <div>
        <a href={gitHubUrl}>GitHub</a>
      </div>
    </SetupTemplate>
  );
};

export default Register;
