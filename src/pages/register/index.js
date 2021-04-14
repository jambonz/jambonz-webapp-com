import React from "react";
import styled from "styled-components/macro";
import { v4 as uuid } from "uuid";

import RoundButton from "../../components/elements/RoundButton";
import Link from "../../components/elements/Link";

const InviteConfirmContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 6rem 0 6rem;
`;

const HeaderTitle = styled.h2`
  font-family: Objectivity;
  font-size: 24px;
  font-weight: 500;
  line-height: 1.67;
  letter-spacing: -0.03px;
  text-align: center;
  color: #231f20;
  max-width: 500px;
  margin: 0 1rem 2rem;
`;

const Description = styled.p`
  font-family: Objectivity;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.89;
  letter-spacing: -0.02px;
  text-align: center;
  color: #231f20;
  max-width: 600px;
  margin: 0 1rem 4rem;
`;

const H3 = styled.h3`
  font-family: Objectivity;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.89;
  letter-spacing: -0.02px;
  text-align: center;
  color: #231f20;
  margin-bottom: 1rem;
`;

const ALink = styled.a`
  font-family: Objectivity;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.89;
  letter-spacing: -0.02px;
  text-align: center;
  color: #da1c5c;

  &:hover {
    color: #da1c5c;
  }
`;

const SignupButtonsWrapper = styled.div`
  pointer-events: none;
  opacity: 0.5;
  margin-top: 6rem;
`;

const Register = (props) => {
  const state = uuid();
  localStorage.setItem("location-before-oauth", "/register");
  localStorage.setItem("oauth-state", state);
  const gitHubUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&state=${state}&scope=user:email&allow_signup=false`;
  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=email+profile+https://www.googleapis.com/auth/cloud-platform&access_type=offline&include_granted_scopes=true&response_type=code&state=${state}&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URI}&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}`;

  return (
    <InviteConfirmContainer>
      <HeaderTitle>
        jambonz will launch soon, but currently we are running a private beta.
      </HeaderTitle>
      <Description>
        If you would like to participate in the private beta, and are willing to
        share your feedback and actively participate, email us at{" "}
        <ALink href="mailto:support@jambonz.com">support@jambonz.com</ALink> for
        an invite code.
      </Description>
      <RoundButton
        fill="transparent"
        color="#231f20"
        border="#231f20"
        width="320px"
        fontSize="18px"
      >
        Enter invite code
      </RoundButton>
      <SignupButtonsWrapper>
        <H3>
          Sign up with <ALink href={gitHubUrl}>Github</ALink>
        </H3>
        <H3>
          Sign up with <ALink href={googleUrl}>Google</ALink>
        </H3>
        <H3>
          Sign up with your <Link to="/register/email">email</Link>
        </H3>
      </SignupButtonsWrapper>
    </InviteConfirmContainer>
  );
};

export default Register;
