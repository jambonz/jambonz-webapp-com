import styled from 'styled-components/macro';

const H1 = styled.h1`
  font-size: 3rem;
  margin: 0;
  font-weight: ${props => props.bold ? "bold" : "normal"};

  ${props => props.external && `
    margin-bottom: 3rem;
    text-align: center;

    ${props.theme.mobileOnly} {
      width: ${props.theme.externalMaxWidth};
      max-width: 100%;
      margin-bottom: 1.5rem;
      text-align: left;
    }
  `}

  ${props => props.theme.mobileOnly} {
    font-size: 2rem;
  }
`;

export default H1;
