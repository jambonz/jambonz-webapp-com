import styled from "styled-components/macro";
import NavItem from "./NavItem";
import NavDrawer from "./NavDrawer";

const Container = styled.div`
  padding: 16px 0;
  position: relative;
  z-index: 50;
  position: fixed;
  top: -1px;
  left: 0;
  width: 100%;
`;

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  max-width: calc(1440px + 4.4444444444vw * 2);
  width: 100%;
  margin: 0 auto;
  padding-left: 4.4444444444vw;
  padding-right: 4.4444444444vw;
`;

const NavSection = styled.div`
  display: flex;
  align-items: center;
`;

const Nav = (props) => {
  return (
    <Container>
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
    </Container>
  );
};

export default Nav;
