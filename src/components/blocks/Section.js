import styled from 'styled-components/macro';

const StyledSection = styled.section`
  min-width: fit-content;
  margin-bottom: 1.5rem;
  padding: 2rem;
  border-radius: 0.5rem;
  background: #FFF;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.1),
              0px 0px 0.25rem rgba(0, 0, 0, 0.1);
  ${props => !!props.position ? `position: ${props.position};` : ''}

  > *:first-child {
    margin-top: 0;
  }

  > *:last-child {
    margin-bottom: 0;
  }

  ${props => props.fullPage && `
    height: 100%;
    min-width: auto;
    margin: 0;
    border-radius: 0;
    overflow: auto;
  `}

  ${props => props.theme.mobileOnly} {
    padding: 1rem;
    
    ${props => props.normalTable && `
      height: 100%;
      min-width: auto;
      margin: 0;
      border-radius: 0;
      overflow: auto;
    `}
  }
`;

const Section = props => {
  return (
    <StyledSection
      fullPage={props.fullPage}
      normalTable={props.normalTable}
      position={props.position}
    >
      {props.children}
    </StyledSection>
  );
};

export default Section;
