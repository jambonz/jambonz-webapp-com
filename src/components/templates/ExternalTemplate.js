import Nav from "../blocks/Nav";
import styled from "styled-components/macro";

import LogoJambong from "../../images/logo-jambong.svg";
import StaticURLs from "../../data/StaticURLs";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 12rem 1rem 8rem;

  ${(props) =>
    props.fullPage &&
    `
    height: calc(100vh - 20rem);
    justify-content: center;
  `}

  ${(props) => props.theme.mobileOnly} {
    margin: 5.5rem 1rem;
  }
`;

const ContentContainer = styled.div`
  width: ${(props) => props.theme.externalMaxWidth};
  max-width: 100%;
`;

const ExternalTemplate = (props) => (
  <>
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
          text: "Register",
          url: "/register",
          desktopOnly: true,
        },
      ]}
      drawer={[
        { type: "linkExternal", text: "Home", url: StaticURLs.HOME },
        {
          type: "linkExternal",
          text: "Pricing",
          url: StaticURLs.PRICING,
        },
        {
          type: "linkExternal",
          text: "Docs",
          url: StaticURLs.FOR_DEVELOPERS,
        },
        { type: "link", text: "Register", url: "/register" },
        { type: "link", text: "Sign In", url: "/sign-in" },
        { type: "horizontal-rule" },
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
      drawerAlignment="center"
    />
    <PageContainer fullPage={props.fullPage}>
      <ContentContainer>{props.children}</ContentContainer>
    </PageContainer>
  </>
);

export default ExternalTemplate;
