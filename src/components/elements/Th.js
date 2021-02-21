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

  ${props => props.sectionTableWithHeader && `
    padding: 2rem 2rem 1.5rem;
    background: #fff;
  `}

  ${props => props.containsSquareButton && `
    width: 4rem;
    padding: 1.5rem;
    text-align: right;
  `}

  ${props => props.simpleTable && `
    color: #707070;
    padding: 0 2rem 1rem 0;
  `}
`;

export default Th;
