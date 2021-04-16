import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components/macro';
import { ModalStateContext } from '../../contexts/ModalContext';
import { ReactComponent as HomeIcon         } from '../../images/HomeIcon.svg';
import { ReactComponent as ApplicationsIcon } from '../../images/ApplicationsIcon.svg';
import { ReactComponent as RecentCallsIcon  } from '../../images/RecentCallsIcon.svg';
import { ReactComponent as AlertsIcon       } from '../../images/AlertsIcon.svg';
import { ReactComponent as CarriersIcon     } from '../../images/CarriersIcon.svg';
import { ReactComponent as PhoneNumbersIcon } from '../../images/PhoneNumbersIcon.svg';
import { ReactComponent as SpeechIcon       } from '../../images/SpeechIcon.svg';

const StyledSideMenu = styled.div`
  width: 15rem;
  flex-shrink: 0;
  height: calc(100vh - 4rem);
  margin-top: 4rem;
  overflow: auto;
  background: #FFF;
  padding: 3.25rem 0;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.12);
  z-index: 40;

  ${props => props.theme.mobileOnly} {
    display: none;
  }
`;

const activeClassName = 'nav-item-active';

const StyledNavLink = styled(NavLink).attrs({ activeClassName })`
  height: 2.75rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: stretch;
  font-weight: 500;
  text-decoration: none;
  color: #565656;
  fill: #565656;

  &.${activeClassName} {
    box-shadow: inset 3px 0 0 0 #D91C5C;
    color: #D91C5C;
    fill: #D91C5C;
  }

  &:focus {
    outline: 0;
    box-shadow: inset 0 0 0 3px #D91C5C;
  }

  &:hover {
    background: RGBA(217, 28, 92, 0.1);
    color: #C0134D;
    fill: #C0134D;
  }
  &.${activeClassName}:hover {
    color: #D91C5C;
    fill: #D91C5C;
  }
`;

const IconContainer = styled.span`
  width: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: 0;
`;

const MenuText = styled.span`
  display: flex;
  flex-grow: 1;
  align-items: center;
  outline: 0;
`;

const StyledH2 = styled.h2`
  margin: 3rem 0 1rem 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  color: #757575;
`;

const MenuLink = props => {
  const modalOpen = useContext(ModalStateContext);
  return (
    <StyledNavLink
      exact={props.exact}
      to={props.to}
      activeClassName={activeClassName}
      tabIndex={modalOpen ? '-1' : ''}
    >
      <IconContainer tabIndex="-1">
        {props.icon}
      </IconContainer>
      <MenuText tabIndex="-1">
        {props.name}
      </MenuText>
    </StyledNavLink>
  );
};

const SideMenu = () => {
  return (
    <StyledSideMenu>
      <MenuLink exact to="/account"           name="Home"             icon={<HomeIcon         />} />
      <MenuLink to="/account/applications"    name="Applications"     icon={<ApplicationsIcon />} />
      <MenuLink to="/account/recent-calls"    name="Recent Calls"     icon={<RecentCallsIcon  />} />
      <MenuLink to="/account/alerts"          name="Alerts"           icon={<AlertsIcon       />} />

      <StyledH2>Bring Your Own Services</StyledH2>
      <MenuLink to="/account/carriers"        name="Carriers"         icon={<CarriersIcon     />} />
      <MenuLink to="/account/speech-services" name="Speech"           icon={<SpeechIcon       />} />
      <MenuLink to="/account/phone-numbers"   name="Phone Numbers"    icon={<PhoneNumbersIcon />} />
    </StyledSideMenu>
  );
};

export default SideMenu;
