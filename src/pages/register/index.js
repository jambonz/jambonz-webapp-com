import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled from "styled-components/macro";
import { v4 as uuid } from "uuid";

import RoundButton from "../../components/elements/RoundButton";
import Link from "../../components/elements/Link";
import Modal from "../../components/blocks/Modal";
import Input from "../../components/elements/Input";
import Checkbox from "../../components/elements/Checkbox";
import FormError from "../../components/blocks/FormError";
import ExternalMain from "../../components/wrappers/ExternalMain";
import StaticURLs from "../../data/StaticURLs";

const InviteConfirmContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  margin-top: ${(props) => props.marginTop || "0"};

  @media (max-width: 767.98px) {
    margin-top: 0;
  }
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
  line-height: 1;
  letter-spacing: -0.02px;
  text-align: ${(props) => props.textAlign || "center"};
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

const SignupButtonsWrapper = styled.div`
  ${(props) =>
    props.show
      ? `opacity: 1;`
      : `
    pointer-events: none;
    opacity: 0.5;
  `}
  margin-top: 6rem;
`;

const StyledFormError = styled(FormError)`
  margin-top: 1rem;
`;

const StyledInput = styled(Input)`
  min-width: 380px;

  @media (max-width: 575px) {
    width: 100%;
    min-width: 200px;
  }
`;

const SuccessAlarm = styled.p`
  color: #231f20;
  font-family: Objectivity;
  font-weight: bold;
  font-size: 24px;
  text-align: center;
  margin-bottom: 0;
  height: 60px;
`;

const PrivacyCheckbox = styled.div`
  display: flex;
  align-items: center;
  max-width: 350px;
  margin-bottom: 1rem;

  h3 {
    margin-bottom: 0;
    line-height: 1.5;
    text-align: left;
  }
`;

const Register = (props) => {
  const state = uuid();
  localStorage.setItem("location-before-oauth", "/register");
  localStorage.setItem("oauth-state", state);
  const gitHubUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&state=${state}&scope=user:email&allow_signup=false`;
  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=email+profile+https://www.googleapis.com/auth/cloud-platform&access_type=offline&include_granted_scopes=true&response_type=code&state=${state}&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URI}&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}`;
  const betaFlag = process.env.REACT_APP_BETA_FLAG === "true";

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [code, setCode] = useState("");
  const [codeInvalid, setCodeInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [codeConfirmed, setCodeConfirmed] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

  const refCode = useRef(null);

  const handleCodeSubmit = async () => {
    try {
      setCodeInvalid(false);
      setErrorMessage("");
      setLoading(true);

      if (!code) {
        setCodeInvalid(true);
        setErrorMessage("Enter your invite code.");
        return;
      }

      const result = await axios({
        method: "post",
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: `/InviteCodes`,
        data: {
          code,
          test: true,
        },
      });

      if (result.status === 204) {
        setCodeConfirmed(true);
        setShowConfirmModal(false);
        localStorage.setItem("register-code", code);
      }
    } catch (err) {
      const errorMessage =
        "Hmm, looks like that code was taken.  Please try again.";
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const CheckPrivacyAndTerms = () => (
    <PrivacyCheckbox>
      <Checkbox
        noLeftMargin
        label=""
        name="privacy"
        id="privacy"
        checked={privacyChecked}
        onChange={(e) => setPrivacyChecked(e.target.checked)}
      />
      <H3>
        I accept the{" "}
        <ALink href={StaticURLs.TERMS_OF_SERVICE} target="__blank">
          Terms of Service
        </ALink>{" "}
        and have read the{" "}
        <ALink href={StaticURLs.PRIVACY_POLICY} target="__blank">
          Privacy Policy
        </ALink>
      </H3>
    </PrivacyCheckbox>
  );

  useEffect(() => {
    localStorage.removeItem("register-code");
  }, []);

  return (
    <InviteConfirmContainer marginTop={betaFlag ? "" : "5rem"}>
      {showConfirmModal && (
        <Modal
          title="Enter invite code"
          closeText="Close"
          loader={loading}
          content={
            <>
              <StyledInput
                type="text"
                name="code"
                id="code"
                ref={refCode}
                placeholder="code"
                value={code}
                onChange={(e) => {
                  setCodeInvalid(false);
                  setCode(e.target.value);
                }}
                autoFocus
              />
              {errorMessage && <StyledFormError grid message={errorMessage} />}
            </>
          }
          handleCancel={() => setShowConfirmModal(false)}
          actionText="Ok"
          handleSubmit={() => !codeInvalid && handleCodeSubmit()}
          normalButtonPadding
        />
      )}
      {betaFlag ? (
        <>
          <HeaderTitle>
            jambonz will launch soon, but currently we are running a private
            beta.
          </HeaderTitle>
          <Description>
            If you would like to participate in the private beta, and are
            willing to share your feedback and actively participate, email us at{" "}
            <ALink href="mailto:support@jambonz.org?subject=Requesting invitation to the beta">
              support@jambonz.org
            </ALink>{" "}
            to request an invite code.
          </Description>
          {codeConfirmed ? (
            <SuccessAlarm
              fill="transparent"
              color="#231f20"
              border="transparent"
              width="320px"
              fontSize="24px"
            >
              You're in!
              <br />
              Sign up using one of the options below
            </SuccessAlarm>
          ) : (
            <RoundButton
              fill="transparent"
              color="#231f20"
              border="#231f20"
              width="320px"
              fontSize="18px"
              onClick={() => setShowConfirmModal(true)}
            >
              Enter invite code
            </RoundButton>
          )}
          <SignupButtonsWrapper show={codeConfirmed}>
            <CheckPrivacyAndTerms />
            <H3>
              Sign up with{" "}
              <ALink disabled={!privacyChecked} href={gitHubUrl}>
                Github
              </ALink>
            </H3>
            <H3>
              Sign up with{" "}
              <ALink disabled={!privacyChecked} href={googleUrl}>
                Google
              </ALink>
            </H3>
            <H3>
              Sign up with your{" "}
              <Link disabled={!privacyChecked} to="/register/email">
                email
              </Link>
            </H3>
          </SignupButtonsWrapper>
        </>
      ) : (
        <ExternalMain title="Register">
          <CheckPrivacyAndTerms />
          <H3 textAlign="left">Sign up with:</H3>
          <H3 textAlign="left">
            <ALink disabled={!privacyChecked} href={gitHubUrl}>
              Github
            </ALink>
          </H3>
          <H3 textAlign="left">
            <ALink disabled={!privacyChecked} href={googleUrl}>
              Google
            </ALink>
          </H3>
          <H3 textAlign="left">
            <Link disabled={!privacyChecked} to="/register/email">
              Email
            </Link>
          </H3>
        </ExternalMain>
      )}
    </InviteConfirmContainer>
  );
};

export default Register;
