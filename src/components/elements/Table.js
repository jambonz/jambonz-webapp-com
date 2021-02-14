import styled from 'styled-components/macro';

const Table = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
  white-space: nowrap;
  ${props => props.fullWidth ? `
    min-width: 100%;
  ` : `
    width: 38rem;
    min-width: 100%;
  `}

  & > thead {
    background: #F7F7F7;
  }

  & tr {
    border-bottom: 1px solid #E0E0E0;
  }

  & thead tr {
    height: 4rem;
  }

  & tbody tr {
    height: ${props => props.condensed
      ? '2.5rem'
      : '5.5rem'
    };
  }

  ${props => props.fullWidth ? '' : `
    & tbody tr:last-child {
      border-bottom: 0;
    }
  `}

  & th {
    text-align: left;
    font-weight: normal;
    color: #717171;
  }

  & th,
  & td {
    padding: 0 1.5rem;
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

  & td:first-child {
    font-weight: bold;
  }

  ${props => props.fullWidth ? '' : `
    & td:last-child {
      overflow: inherit;
      position: relative;
      padding: 0.5rem;
    }
  `}

  ${props => props.withCheckboxes && `
    & th:first-child,
    & td:first-child {
      width: 3rem;
      padding: 1.25rem 0 1.25rem 1.25rem;
    }
    & td:nth-child(2) {
      font-weight: bold;
    }
  `}

  ${props => props.rowsHaveDeleteButtons && `
    & th:last-child {
      width: 9rem;
      text-align: right;
    }
    & td:last-child {
      padding: 0 1.5rem;
      text-align: right;
    }
  `}
`;

export default Table;
