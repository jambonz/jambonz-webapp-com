import { v4 as uuid } from "uuid";
import styled from "styled-components/macro";
import { Link as ReactRouterLink } from "react-router-dom";

import InternalMain from "../../../../components/wrappers/InternalMain";
import H3 from "../../../../components/elements/H3";
import P from "../../../../components/elements/P";
import Section from "../../../../components/blocks/Section";
import InputGroup from "../../../../components/elements/InputGroup";
import Button from "../../../../components/elements/Button";
import { ReactComponent as GithubIcon } from "../../../../images/GithubIcon.svg";
import GoogleIcon from "../../../../images/GoogleButtonIcon.png";
import { ReactComponent as TwitterIcon } from "../../../../images/TwitterButtonIcon.svg";

const EmailCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: "WorkSans";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #565656;
  width: 141px;
  height: 48px;
  border: 3px solid #707070;
  box-sizing: border-box;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SettingsAuthIndex = () => {
  const state = uuid();
  localStorage.setItem("location-before-oauth", "/register");
  localStorage.setItem("oauth-state", state);
  const gitHubUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&state=${state}&scope=user:email&allow_signup=false`;
  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=email+profile+https://www.googleapis.com/auth/cloud-platform&access_type=offline&include_granted_scopes=true&response_type=code&state=${state}&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URI}&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}`;

  return (
    <InternalMain
      type="form"
      title="Authentication Method"
      breadcrumbs={[{ name: "Back to Settings", url: "/account/settings" }]}
    >
      <Section>
        <H3>Current Authentication Method</H3>
        <EmailCard>Email</EmailCard>
        <P>
          If you would like to sign in a different way, click an option below.
        </P>
        <H3>Other ways to sign in</H3>
        <InputGroup spaced>
          <a href={googleUrl}>
            <img src={GoogleIcon} alt="google-icon" />
          </a>
          <a href={gitHubUrl}>
            <GithubIcon />
          </a>
          <TwitterIcon />
        </InputGroup>
        <InputGroup flexEnd spaced>
          <Button gray="true" as={ReactRouterLink} to="/account/settings">
            Cancel
          </Button>
        </InputGroup>
      </Section>
    </InternalMain>
  );
};

export default SettingsAuthIndex;
