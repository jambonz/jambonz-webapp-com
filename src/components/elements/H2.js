import styled from 'styled-components/macro';

const H2 = styled.h2`
  font-size: 1.5rem;
  margin: 0 0 1.5rem;
  font-weight: ${props => props.bold ? "bold" : "normal"};
  ${props => props.inTable && `
    margin: 0;
  `}
  color: #231f20;
`;

export default H2;
