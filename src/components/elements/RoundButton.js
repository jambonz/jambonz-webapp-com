import React from "react";
import styled from "styled-components/macro";
import PropTypes from "prop-types";

const StyledButton = styled.a`
  background-color: ${(props) => props.fill};
  color: ${(props) => props.color};
  border: 2px solid ${(props) => props.border} !important;
  height: ${(props) => props.height};
  ${(props) => (props.width ? `width: ${props.width};` : ``)}
  font-size: ${props => props.fontSize || "16px"};
  line-height: 1;
  padding: 0 34px;
  text-decoration: none;
  border-radius: 30px;
  display: inline-block;
  font-family: Objectivity;
  font-weight: bold;
  font-family: "Objectivity";
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    color: ${(props) => props.color};
  }
`;

const RoundButton = ({ fill, border, color, children, ...rest }) => (
  <StyledButton fill={fill} border={border} color={color} {...rest}>
    {children}
  </StyledButton>
);

RoundButton.propTypes = {
  fill: PropTypes.string,
  color: PropTypes.string,
  border: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
};

RoundButton.defaultProps = {
  fill: "#fff",
  color: "#da1c5c",
  border: "#fff",
  height: "3.75rem",
  width: "",
};

export default RoundButton;
