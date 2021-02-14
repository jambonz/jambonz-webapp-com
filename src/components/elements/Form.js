import styled from 'styled-components/macro';

const Form = styled.form`
  text-align: ${props => props.left ? 'left' : 'right'};
  ${props => !props.large && `
    & input {
      margin-bottom: 1rem;
    }
  `}

  > *:first-child {
    margin-top: 0;
  }

  > *:last-child {
    margin-bottom: 0;
  }

  & hr {
    margin: 0 -2rem;
    background: none;
    border: 0;
    border-top: 1px solid #C6C6C6;
    grid-column: 1 / 3;
  }
  ${props => props.large && `
    display: grid;
    grid-template-columns: ${props.wideLabel
      ? '1.75fr'
      : '1.3fr'
    } 10fr;
    grid-row-gap: 1rem;
    grid-column-gap: 0.75rem;
    align-items: center;
  `}
`;

export default Form;
