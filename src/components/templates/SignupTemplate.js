import React from "react";
import styled from "styled-components/macro";

import Nav from "../blocks/Nav";

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
`;

const PageContainer = styled.div`
  width: 640px;
  max-width: 100%;
  margin: 3rem 0 6rem;
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
      ]}
      topRight={[
        {
          type: "link",
          text: "Sign In",
          url: "/sign-in",
          desktopOnly: true,
        },
      ]}
      drawer={[
        { type: "linkExternal", text: "Home", url: "https://www.jambonz.org" },
        {
          type: "linkExternal",
          text: "Why jambonz",
          url: "https://www.jambonz.org/docs",
        },
        {
          type: "linkExternal",
          text: "For Developers",
          url: "https://www.jambonz.org/docs",
        },
        {
          type: "linkExternal",
          text: "Pricing",
          url: "https://www.jambonz.org/pricing",
        },
        { type: "link", text: "Register", url: "/register" },
        { type: "link", text: "Sign In", url: "/sign-in" },
        { type: "horizontal-rule" },
        { type: "linkExternal", text: "View on Github", url: "#" },
        { type: "linkExternal", text: "Join us on Slack", url: "#" },
        { type: "linkExternal", text: "Privacy Policy", url: "#" },
        {
          type: "linkExternal",
          text: "Terms of Service",
          url: "https://www.jambonz.org/docs/terms-of-service",
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
