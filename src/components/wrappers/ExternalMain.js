import { useContext, useEffect } from "react";
import styled from "styled-components/macro";

import { CurrentMenuDispatchContext } from "../../contexts/CurrentMenuContext";
import H1 from "../../components/elements/H1";
import Section from "../../components/blocks/Section";

const StyledSection = styled(Section)`
  width: 32rem;
  min-width: 32rem;
  margin: 0 auto;

  @media (max-width: 767px) {
    min-width: 0;
    width: 100%;
  }
`;

const ExternalMain = (props) => {
  const setCurrentMenu = useContext(CurrentMenuDispatchContext);

  useEffect(() => {
    setCurrentMenu(null);
    document.title = `${props.title} | jambonz`;
  });

  return (
    <>
      <H1 external>{props.title}</H1>
      <StyledSection>{props.children}</StyledSection>
    </>
  );
};

export default ExternalMain;
