import { useContext } from "react";
import styled from "styled-components/macro";

import { NotificationDispatchContext } from "../../contexts/NotificationContext";

const CopyArea = styled.span`
  font-family: 'WorkSans';
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #D91C5C;
  cursor: pointer;
`;

const Copy = ({ title, value }) => {
  const dispatch = useContext(NotificationDispatchContext);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(value);
      dispatch({
        type: "ADD",
        level: "success",
        message: `${title} copied to clipboard`,
      });
    } catch (err) {
      dispatch({
        type: "ADD",
        level: "error",
        message: `Unable to copy ${title}, please select the text and right click to copy`,
      });
    }
  };

  return <CopyArea onClick={copyText}>Copy</CopyArea>;
};

export default Copy;
