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
  ${(props) =>
    !props.noShadow
      ? `box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.12);`
      : ""}
`;

const NavSection = styled.div`
  display: flex;
  align-items: center;

  ${(props) =>
    props.center
      ? `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `
      : ""}
`;

const Nav = (props) => {
  return (
    <StyledNav noShadow={props.noShadow}>
      <NavSection>
        {props.topLeft.map((item, i) => (
          <NavItem navMain={i === 0} item={item} key={i} />
        ))}
      </NavSection>

      {props.topCenter && (
        <NavSection center>
          {props.topCenter.map((item, i) => (
            <NavItem item={item} key={i} />
          ))}
        </NavSection>
      )}

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
