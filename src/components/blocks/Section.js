import styled from 'styled-components/macro';

const StyledSection = styled.section`
  min-width: fit-content;
  margin-bottom: 1.5rem;
  padding: 2rem;
  border-radius: 0.5rem;
  background: #FFF;
  ${props => !!props.position ? `position: ${props.position};` : ''}
  box-shadow: 0 0px 0px rgb(0 0 0 / 10%), 0px 0px 0.25rem rgb(0 0 0 / 10%);

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
      margin: 1rem;
      border-radius: 0;
      overflow: auto;
    `}
  }
`;

const Section = props => {
  return (
    <StyledSection
      {...props}
      fullPage={props.fullPage}
      normalTable={props.normalTable}
      position={props.position}
    >
      {props.children}
    </StyledSection>
  );
};

export default Section;
