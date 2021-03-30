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
import handleErrors from "../../../../helpers/handleErrors";
import ContactIconButton from '../../../../components/elements/ContactIconButton';
import EmailIconButton from '../../../../components/elements/EmailIconButton';

const StyledP = styled(P)`
  margin-top: 1rem;
`;

const ProviderLink = styled.a`
  text-decoration: none;
  ${(props) =>
    props.disabled
      ? `
    pointer-events: none;
    cursor: default;
  `
      : ""}
`;

const StyledInputGroup = styled(InputGroup)`
  margin-bottom: 1rem;

  @media(max-width: 576.98px) {
    flex-direction: column;

    & > a {
      margin-right: 0;
      margin-bottom: 0.5rem;
      width: 100%;

      & > div {
        width: 100%;
      }
    }

    & > div[type='email'] {
      width: 100%;
    }
  }
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

  const AuthMethod = ({ method, absolute }) => {
    let node;
    switch (method) {
      case "local":
        node = (
          <EmailIconButton
            type="email"
            selected={method === provider}
            onClick={() => history.push("/account/settings/auth/email")}
          >
            Email
          </EmailIconButton>
        );
        break;
      case "github":
        node = (
          <ProviderLink href={gitHubUrl} disabled={provider === method}>
            <ContactIconButton type="github" absolute={absolute} />
          </ProviderLink>
        );
        break;
      case "google":
        node = (
          <ProviderLink href={googleUrl} disabled={provider === method}>
            <ContactIconButton type="google" absolute={absolute} />
          </ProviderLink>
        );
        break;
      case "twitter":
        node = (
          <ProviderLink href="#" disabled={provider === method}>
            <ContactIconButton type="twitter" absolute={absolute} />
          </ProviderLink>
        );
        break;
      default:
        break;
    }

    return node;
  };

  useEffect(() => {
    let isMounted = true;

    const getAPIData = async () => {
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

    return () => {
      isMounted = false;
    };
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
          <AuthMethod method={provider} absolute={false} />
          <StyledP>
            If you would like to sign in a different way, click an option below.
          </StyledP>
          <H3>Other ways to sign in</H3>
          <StyledInputGroup spaced>
            {authenticationMethods
              .filter((method) => method !== provider)
              .map((method) => (
                <AuthMethod key={method} method={method} />
              ))}
          </StyledInputGroup>
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
