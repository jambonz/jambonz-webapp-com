import { useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import H1 from '../../components/elements/H1';
import Section from '../../components/blocks/Section';
import Link from '../../components/elements/Link';

const Register = props => {
  useEffect(() => {
    document.title = `Register | jambonz`;
  });

  const state = uuid();
  localStorage.setItem('location-before-oauth', '/register');
  localStorage.setItem('oauth-state', state);
  const gitHubUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&state=${state}&scope=user:email&allow_signup=false`;
  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=email+profile+https://www.googleapis.com/auth/cloud-platform&access_type=offline&include_granted_scopes=true&response_type=code&state=${state}&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URI}&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}`;

  return (
    <>
      <H1 external>Register</H1>
      <Section>
        <p>Register with:</p>
        <p><a href={gitHubUrl}>GitHub</a></p>
        <p><a href={googleUrl}>Google</a></p>
        <p><Link to="/register/email">Email</Link></p>
      </Section>
    </>
  );
};

export default Register;
