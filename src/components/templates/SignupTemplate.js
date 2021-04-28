import React from "react";
import styled from "styled-components/macro";

import Nav from "../blocks/Nav";
import StaticURLs from "../../data/StaticURLs";

import LogoJambong from "../../images/logo-jambong.svg";

const SignupTemplateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding-top: 64px;
  overflow: auto;
  height: 100vh;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 767.98px) {
    margin: 5.5rem 1rem;
    padding-top: 0;
  }
`;

const PageContainer = styled.div`
  width: 640px;
  max-width: 100%;
  margin: 3rem 0 6rem;

  @media (max-width: 767.98px) {
    margin-top: 0;
  }
`;

const SignupTemplate = (props) => (
  <SignupTemplateContainer>
    <Nav
      topLeft={[
        {
          type: "image-link",
          url: "/",
          image: LogoJambong,
          desktopOnly: false,
        },
        {
          type: "linkExternal",
          text: "Why jambonz",
          url: StaticURLs.WHY_JAMBONZ,
          desktopOnly: true,
        },
        {
          type: "linkExternal",
          text: "For Developers",
          url: StaticURLs.FOR_DEVELOPERS,
          desktopOnly: true,
        },
        {
          type: "linkExternal",
          text: "Pricing",
          url: StaticURLs.PRICING,
          desktopOnly: true,
        },
      ]}
      topRight={[
        {
          type: "button-link",
          text: "Sign In",
          url: "/sign-in",
          desktopOnly: true,
        },
      ]}
      drawer={[
        {
          type: "linkExternal",
          text: "Home",
          url: StaticURLs.HOME,
        },
        {
          type: "linkExternal",
          text: "Why jambonz",
          url: StaticURLs.WHY_JAMBONZ,
        },
        {
          type: "linkExternal",
          text: "For Developers",
          url: StaticURLs.FOR_DEVELOPERS,
        },
        {
          type: "linkExternal",
          text: "Pricing",
          url: StaticURLs.PRICING,
        },
        { type: "link", text: "Register", url: "/register" },
        { type: "link", text: "Sign In", url: "/sign-in" },
        { type: "horizontal-rule" },
        { type: "linkExternal", text: "View on Github", url: "#" },
        { type: "linkExternal", text: "Join us on Slack", url: "#" },
        {
          type: "linkExternal",
          text: "Privacy Policy",
          url: StaticURLs.PRIVACY_POLICY,
        },
        {
          type: "linkExternal",
          text: "Terms of Service",
          url: StaticURLs.TERMS_OF_SERVICE,
        },
        {
          type: "linkExternal",
          text: "support@jambonz.org",
          url: "mailto:support@jambonz.org",
        },
      ]}
    />
    <PageContainer>{props.children}</PageContainer>
  </SignupTemplateContainer>
);

export default SignupTemplate;
