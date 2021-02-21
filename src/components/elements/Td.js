import styled from 'styled-components/macro';

const Td = styled.td`
  padding: 0 2rem;

  ${props => props.textAlign && `
    text-align: ${props.textAlign};
  `}

  ${props => props.bold && `
    font-weight: bold;
  `}

  ${props => props.containsMenuButton && `
    overflow: inherit;
    position: relative;
    width: 4rem;
    text-align: right;
    padding: 0.5rem;
  `}

  ${props => props.deleteModal && `
    padding: 0.5rem 0;

    &:first-child {
      font-weight: 500;
      padding-right: 1.5rem;
      vertical-align: top;
    }

    & ul {
      margin: 0;
      padding-left: 1.25rem;
    }
  `}

  ${props => props.simpleTable && `
    padding: 0 0 1rem 0;
  `}
`;

export default Td;
