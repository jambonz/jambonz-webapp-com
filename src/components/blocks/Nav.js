import styled from 'styled-components/macro';
import NavItem from './NavItem';

const StyledNav = styled.nav`
  position: relative;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
  padding: 0.5rem 1rem;
  background: #fff;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.12);
`;

const NavSection = styled.div`
  display: flex;
  align-items: center;
`;

const Nav = props => {
  return (
    <StyledNav>
      <NavSection>
        {props.topLeft.map((item, i) => (
          <NavItem
            navMain={i === 0}
            item={item}
            key={i}
          />
        ))}
      </NavSection>

      <NavSection>
        {props.topRight.map((item, i) => (
          <NavItem
            item={item}
            key={i}
          />
        ))}
      </NavSection>
    </StyledNav>
  );
};

export default Nav;
