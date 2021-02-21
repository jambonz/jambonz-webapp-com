import React, { useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components/macro';
import { NotificationDispatchContext } from '../../contexts/NotificationContext';
import Link from '../elements/Link';
import Button from '../elements/Button';

const StyledNav = styled.nav`
  position: relative;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.12);
`;

const NavH1 = styled.h1`
  margin: 1.25rem 0 1.25rem 2rem;
  font-size: 1.5rem;
  font-weight: normal;
  line-height: 1em;
`;

const SignOutContainer = styled.div`
  margin-right: 3rem;
  @media (max-width: 34rem) {
    margin-right: 1rem;
  }
`;

const Nav = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useContext(NotificationDispatchContext);

  const signOut = () => {
    const jwt = localStorage.getItem('jwt');
    // not using async/await because the user's storage should be cleared
    // and they should be redirected to the login page regardless of whether
    // or not the API finds the user's JWT
    axios({
      method: 'post',
      baseURL: process.env.REACT_APP_API_BASE_URL,
      url: '/logout',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    localStorage.clear();
    sessionStorage.clear();
    history.push('/');
    dispatch({
      type: 'ADD',
      level: 'success',
      message: "You've successfully logged out",
    });
  };

  return (
    <StyledNav>
      <NavH1>jambonz</NavH1>
      {location.pathname !== '/' && (
        <SignOutContainer>
          <Link to="/account/settings">
            Settings
          </Link>
          <Button
            large
            gray
            text
            onClick={signOut}
          >
            Sign Out
          </Button>
        </SignOutContainer>
      )}
    </StyledNav>
  );
};

export default Nav;
