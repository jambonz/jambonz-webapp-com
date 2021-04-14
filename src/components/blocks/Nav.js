import styled from "styled-components/macro";
import NavItem from "./NavItem";
import NavDrawer from "./NavDrawer";

const StyledNav = styled.nav`
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  top: -1px;
  left: 0;
  width: 100%;
  height: 4rem;
  z-index: 50;
  padding: 0.5rem 1rem;
  background: #fff;
`;

const NavSection = styled.div`
  display: flex;
  align-items: center;
`;

const Nav = (props) => {
  return (
    <StyledNav>
      <NavSection>
        {props.topLeft.map((item, i) => (
          <NavItem navMain={i === 0} item={item} key={i} />
        ))}
      </NavSection>

      <NavSection>
        {props.topRight.map((item, i) => (
          <NavItem item={item} key={i} />
        ))}
        <NavDrawer
          drawer={props.drawer}
          drawerAlignment={props.drawerAlignment}
        />
      </NavSection>
    </StyledNav>
  );
};

export default Nav;
