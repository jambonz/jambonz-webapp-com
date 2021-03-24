import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import styled from "styled-components/macro";
import { useHistory, Link as ReactRouterLink } from "react-router-dom";

import InternalMain from "../../../../components/wrappers/InternalMain";
import H3 from "../../../../components/elements/H3";
import P from "../../../../components/elements/P";
import Section from "../../../../components/blocks/Section";
import Loader from "../../../../components/blocks/Loader";
import InputGroup from "../../../../components/elements/InputGroup";
import Button from "../../../../components/elements/Button";
import { NotificationDispatchContext } from "../../../../contexts/NotificationContext";
import { ReactComponent as GithubIcon } from "../../../../images/GithubIcon.svg";
import GoogleIcon from "../../../../images/GoogleButtonIcon.png";
import { ReactComponent as TwitterIcon } from "../../../../images/TwitterButtonIcon.svg";
import handleErrors from "../../../../helpers/handleErrors";

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
  color: ${(props) => (props.selected ? "#565656" : "#ffffff")};
  background: ${(props) => (props.selected ? "#ffffff" : "#707070")};
  width: 141px;
  height: 48px;
  border: 3px solid #707070;
  box-sizing: border-box;
  border-radius: 4px;
  cursor: pointer;
`;

const StyledP = styled(P)`
  margin-top: 1rem;
`;

const ProviderLink = styled.a`
  ${(props) =>
    props.disabled
      ? `
    pointer-events: none;
    cursor: default;
  `
      : ""}
`;

const SettingsAuthIndex = () => {
  const [provider, setProvider] = useState(null);
  const [showLoader, setShowLoader] = useState(true);

  const jwt = localStorage.getItem("jwt");
  const dispatch = useContext(NotificationDispatchContext);
  let history = useHistory();

  const state = uuid();
  localStorage.setItem("location-before-oauth", "/account/settings/auth");
  localStorage.setItem("oauth-state", state);
  const gitHubUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&state=${state}&scope=user:email&allow_signup=false`;
  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=email+profile+https://www.googleapis.com/auth/cloud-platform&access_type=offline&include_granted_scopes=true&response_type=code&state=${state}&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URI}&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}`;

  const authenticationMethods = ["github", "google", "twitter", "local"];

  const AuthMethod = ({ method }) => {
    let node;
    switch (method) {
      case "local":
        node = (
          <EmailCard
            selected={method === provider}
            onClick={() => history.push("/account/settings/auth/email")}
          >
            Email
          </EmailCard>
        );
        break;
      case "github":
        node = (
          <ProviderLink href={gitHubUrl} disabled={provider === method}>
            <GithubIcon />
          </ProviderLink>
        );
        break;
      case "google":
        node = (
          <ProviderLink href={googleUrl} disabled={provider === method}>
            <img src={GoogleIcon} alt="google-icon" />
          </ProviderLink>
        );
        break;
      case "twitter":
        node = <TwitterIcon />;
        break;
      default:
        break;
    }

    return node;
  };

  useEffect(() => {
    const getAPIData = async () => {
      let isMounted = true;
      try {
        const userDataResponse = await axios({
          method: "get",
          baseURL: process.env.REACT_APP_API_BASE_URL,
          url: `/Users/me`,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (isMounted) {
          const user = userDataResponse.data;

          if (user.user) {
            setProvider(user.user.provider || "");
          }

          setShowLoader(false);
        }
      } catch (err) {
        handleErrors({ err, history, dispatch });
      } finally {
        if (isMounted) {
          setShowLoader(false);
        }
      }
    };
    getAPIData();
    // eslint-disable-next-line
  }, []);

  return (
    <InternalMain
      type="form"
      title="Authentication Method"
      breadcrumbs={[{ name: "Back to Settings", url: "/account/settings" }]}
    >
      {showLoader ? (
        <Loader />
      ) : (
        <Section>
          <H3>Current Authentication Method</H3>
          <AuthMethod method={provider} />
          <StyledP>
            If you would like to sign in a different way, click an option below.
          </StyledP>
          <H3>Other ways to sign in</H3>
          <InputGroup spaced>
            {authenticationMethods
              .filter((method) => method !== provider)
              .map((method) => (
                <AuthMethod key={method} method={method} />
              ))}
          </InputGroup>
          <InputGroup flexEnd spaced>
            <Button gray="true" as={ReactRouterLink} to="/account/settings">
              Cancel
            </Button>
          </InputGroup>
        </Section>
      )}
    </InternalMain>
  );
};

export default SettingsAuthIndex;
