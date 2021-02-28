import styled from 'styled-components/macro';

const Table = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
  white-space: nowrap;
  min-width: calc(100% + 4rem);
  margin-left: -2rem;
  margin-right: -2rem;

  &:first-child {
    margin-top: -2rem;
  }

  &:last-child {
    margin-bottom: -2rem;
  }

  &:not(:first-child) {
    margin-top: 1.5rem;
    border-top: 1px solid #E0E0E0;
  }

  & tr {
    border-bottom: 1px solid #E0E0E0;
  }

  & thead tr {
    height: ${props => props.condensed
      ? '2.5rem'
      : '4rem'
    };

    ${props => props.theme.mobileOnly} {
      height: 2.5rem;
    }
  }

  & tbody tr {
    height: ${props => props.condensed
      ? '2.5rem'
      : '5.5rem'
    };

    ${props => props.theme.mobileOnly} {
      ${props => props.normalTable && `
        height: 2.5rem;
      `}
    }
  }

  ${props => !props.fullWidth && `
    & tbody tr:last-child {
      border-bottom: 0;
    }
  `}

  ${props => props.theme.mobileOnly} {
    & tbody tr:last-child {
      border-bottom: 1px solid #E0E0E0;
    }
  }

  & thead th {
    background: #F7F7F7;
    color: #717171;

    :first-child {
      border-top-left-radius: 0.5rem;
    }

    :last-child {
      border-top-right-radius: 0.5rem;
    }
  }

  & td > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    padding: 0.5rem 0;
  }

  & td > span > a {
    outline: 0;
    text-decoration: none;
  }

  & td:first-child > span > a > span,
  & td:nth-child(2) > span > a > span {
    outline: 0;
    color: #565656;
  }

  & td:first-child > span > a:hover > span,
  & td:nth-child(2) > span > a:hover > span {
    box-shadow: 0 0.125rem 0 #565656;
  }

  & td > span > a:focus > span {
    padding: 0.625rem;
    margin: -0.625rem;
    border-radius: 0.25rem;
    box-shadow: inset 0 0 0 0.125rem #D91C5C;
  }

  ${props => props.withCheckboxes && `
    & th:first-child,
    & td:first-child {
      width: 3rem;
      padding: 1.25rem 0 1.25rem 1.25rem;
    }
  `}
`;

export default Table;
