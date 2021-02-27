import { useContext } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import styled from 'styled-components/macro';
import { ModalStateContext } from '../../contexts/ModalContext';

const FilteredLink = ({ formLink, right, inModal, nav, navMain, ...props }) => (
  <ReactRouterLink {...props}>{props.children}</ReactRouterLink>
);

const StyledReactRouterLink = styled(FilteredLink)`
  display: inline-flex;
  padding: 0;
  border: 0;
  outline: 0;
  background: none;
  cursor: pointer;
  color: #D91C5C;
  font-weight: 500;
  text-decoration: none;

  & > span {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    outline: 0;
  }

  &:focus > span {
    padding: 0.25rem;
    margin: -0.25rem;
    border-radius: 0.25rem;
    box-shadow: 0 0 0 0.125rem;
  }

  &:hover > span {
    box-shadow: 0 0.125rem 0;
    border-radius: 0;
  }

  &:active > span {}

  ${props => props.formLink && `
    grid-column: 2;
    justify-self: start;
  `}

  ${props => props.right && `
    justify-self: end;
  `}

  ${props => props.nav && `
    margin: 0.25rem;
    color: #565656;

    & > span {
      padding: 0.75rem;
      line-height: 1em;
    }

    &:hover > span {
      background: #E3E3E3;
      box-shadow: none;
      border-radius: 0.25rem;
    }

    &:focus > span {
      margin: 0;
      padding: 0.75rem;
      box-shadow: inset 0 0 0 0.125rem #767676;
    }

    &:active > span  {
      background: #D5D5D5;
    }
  `}

  ${props => props.navMain && `
    margin: 0;
    font-size: 1.5rem;
  `}
`;

const Link = props => {
  const modalOpen = useContext(ModalStateContext);
  return (
    <StyledReactRouterLink
      {...props}
      tabIndex={modalOpen && !props.inModal ? '-1' : ''}
    >
      <span tabIndex="-1">
        {props.children}
      </span>
    </StyledReactRouterLink>
  );
};

export default Link;