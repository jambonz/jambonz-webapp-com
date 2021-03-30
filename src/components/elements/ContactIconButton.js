import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";

import GoogleLogo from "../../images/GoogleLogo.png";
import TwitterIcon from "../../images/TwitterIcon.svg";
import GithubIcon from "../../images/GithubIcon.svg";

const ContactIcons = {
  github: GithubIcon,
  twitter: TwitterIcon,
  google: GoogleLogo,
};

const ContactIconWrapper = styled.div`
  width: 140px;
  height: 48px;
  background: ${(props) => {
    switch (props.type) {
      case "github":
        return "#24292E";
      case "google":
        return "#4285F4";
      case "twitter":
        return "#1DA1F2";
      default:
        return "#24292E";
    }
  }};
  border-radius: 4px;
  display: flex;
  align-items: center;

  ${props => props.theme.mobileOnly} {
    height: 36px;
  }
`;

const ContactIcon = styled.div`
  width: ${(props) => (props.type === "google" ? "40px" : "24px")};
  height: ${(props) => (props.type === "google" ? "40px" : "24px")};
  margin-left: ${(props) => (props.type === "google" ? "4px" : "13px")};

  ${props => props.theme.mobileOnly} {
    width: ${(props) => (props.type === "google" ? "32px" : "24px")};
    height: ${(props) => (props.type === "google" ? "32px" : "24px")};
    margin-left: ${(props) => (props.type === "google" ? "2px" : "13px")};
  }
  
  @media (max-width: 575px) {
    ${props => props.absolute ? `position: absolute;` : ''}
  }

  img {
    width: 100%;
    height: 100%;
  }
`;

const ContactTitle = styled.div`
  flex: 1;
  font-family: WorkSans;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: capitalize;
`;

const ContactIconButton = ({ type, absolute }) => {
  return (
    <ContactIconWrapper type={type}>
      <ContactIcon type={type} absolute={absolute ? 'true': ''}>
        <img src={ContactIcons[type]} alt="contact-icon" />
      </ContactIcon>
      <ContactTitle>{type}</ContactTitle>
    </ContactIconWrapper>
  );
};

ContactIconButton.propTypes = {
  type: PropTypes.string,
  absolute: PropTypes.bool,
};

ContactIconButton.defaultProps = {
  type: "github",
  absolute: true,
};

export default ContactIconButton;
