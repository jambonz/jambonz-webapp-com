import styled from 'styled-components/macro';

const H2 = styled.h2`
  font-size: 1.5rem;
  margin: 0 0 1.5rem;
  font-weight: normal;
  ${props => props.inTable && `
    margin: 0;
  `}
`;

export default H2;
