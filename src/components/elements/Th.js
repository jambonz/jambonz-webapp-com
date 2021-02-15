import styled from 'styled-components/macro';

const Th = styled.th`
  text-align: left;
  font-weight: normal;
  padding: 0 2rem;

  ${props => props.textAlign && `
    text-align: ${props.textAlign};
  `}

  ${props => props.buttonColumn && `
    width: 4rem;
  `}

  ${props => props.containsSquareButton && `
    padding-top: 0;
    padding-bottom: 0;
    text-align: right;
  `}
`;

export default Th;
