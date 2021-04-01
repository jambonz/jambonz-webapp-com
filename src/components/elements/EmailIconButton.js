import styled from "styled-components/macro";

const EmailIconButton = styled.div`
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
  width: 140px;
  height: 48px;
  border: 3px solid #707070;
  box-sizing: border-box;
  border-radius: 4px;
  cursor: pointer;

  ${props => props.theme.mobileOnly} {
    height: 36px;
  }
`;

export default EmailIconButton;
