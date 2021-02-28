import { useState } from 'react';
import styled from 'styled-components/macro';
import NavItem from './NavItem';
import Button from '../elements/Button';

const ButtonLine = styled.span`
  width: 16px;
  height: 2px;
  background: #565656;
`;

const DrawerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.25);
`;

const Drawer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 17rem;
  height: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.drawerAlignment === 'left'
    ? 'flex-start'
    : 'center'
  };
  overflow: auto;
  background: #fff;
`;

const CloseSpan1 = styled.span`
  position: absolute;
  width: 16px;
  height: 2px;
  background: #565656;
  transform: rotate(45deg);
`;

const CloseSpan2 = styled.span`
  position: absolute;
  width: 16px;
  height: 2px;
  background: #565656;
  transform: rotate(-45deg);
`;

const NavMenuButton = props => {
  const [ drawerOpen, setDrawerOpen ] = useState(false);

  return (
    <>
      <Button
        navMenuButton
        gray
        text
        onClick={() => setDrawerOpen(!drawerOpen)}
      >
        <ButtonLine />
        <ButtonLine />
        <ButtonLine />
      </Button>
      {drawerOpen && (
        <DrawerOverlay onClick={() => setDrawerOpen(false)}>
          <Drawer drawerAlignment={props.drawerAlignment} onClick={e => e.stopPropagation()}>
            <Button close gray text onClick={() => setDrawerOpen(false)}>
              <CloseSpan1 />
              <CloseSpan2 />
            </Button>
            {props.drawer.map((item, i) => (
              <NavItem
                item={item}
                key={i}
              />
            ))}
          </Drawer>
        </DrawerOverlay>
      )}
    </>
  );
};

export default NavMenuButton;
