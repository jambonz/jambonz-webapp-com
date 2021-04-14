import React from "react";
import styled from "styled-components/macro";

import RoundButton from '../elements/RoundButton';

import LogoJambong from "../../images/logo-jambong.svg";

const SignupTemplateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  height: 74px;
`;

const PageContainer = styled.div`
  width: 100%;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 65px 0 205px;
  background: #da1c5c;
`;

const FooterLinkContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 128px;
  margin-bottom: 128px;
`;

const FooterLink = styled.a`
  font-family: 'Objectivity';
  font-size: 16px;
  font-weight: 500;
  line-height: 3;
  color: #f8f8f8;
  text-decoration: none;
  width: 220px;

  &:nth-child(odd) {
    text-align: right;
  }

  &:hover {
    color: #f8f8f8;
  }
`;

const FooterLinks = [
  {
    label: "View on Github",
    url: "#",
  },
  {
    label: "Home",
    url: "#",
  },
  {
    label: "Join us on Slack",
    url: "#",
  },
  {
    label: "Why jambonz",
    url: "#",
  },
  {
    label: "Privacy Policy",
    url: "#",
  },
  {
    label: "For Developers",
    url: "#",
  },
  {
    label: "Terms of Service",
    url: "#",
  },
  {
    label: "Pricing",
    url: "#",
  },
];

const SignupTemplate = (props) => (
  <SignupTemplateContainer>
    <Header>
      <img src={LogoJambong} alt="logo-jambomg" />
    </Header>
    <PageContainer>
      {props.children}
      <Footer>
        <FooterLinkContainer>
          {FooterLinks.map((link, index) => (
            <FooterLink key={index} href={link.url}>
              {link.label}
            </FooterLink>
          ))}
        </FooterLinkContainer>
        <RoundButton href={`mailto:support@jambonz.com`}>
          support@jambonz.com
        </RoundButton>
      </Footer>
    </PageContainer>
  </SignupTemplateContainer>
);

export default SignupTemplate;
