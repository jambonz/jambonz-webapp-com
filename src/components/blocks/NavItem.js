import { useEffect, useContext, useRef } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import styled from 'styled-components/macro';
import { CurrentMenuStateContext, CurrentMenuDispatchContext } from '../../contexts/CurrentMenuContext';
import Link from '../elements/Link';
import Button from '../elements/Button';

const SubmenuContainer = styled.div`
  position: relative;
`;

const Submenu = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  max-height: calc(100vh - 4.5rem);
  overflow: auto;
  top: 3.75rem;
  right: 0;
  padding: 2.5rem 2rem 1.5rem;
  border-radius: 0.25rem;
  text-align: center;
  background: #fff;
  box-shadow: 0 0       0.25rem rgba(0, 0, 0, 0.1),
              0 0.25rem 0.5rem  rgba(0, 0, 0, 0.15);
`;

const SubmenuText = styled.div`
  flex-shrink: 0;
  width: 100%;
  color: #707070;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SubmenuTextLarge = styled(SubmenuText)`
  margin-bottom: 0.5rem;
  color: unset;
  font-size: 1.125rem;
`;

const Hr = styled.hr`
  width: 100%;
  margin: 2rem 0 1rem;
  background: none;
  border: 0;
  border-top: 1px solid #C6C6C6;
  a + & {
    margin-top: 1rem;
  }
`;

const NavItem = ({ navMain, item }) => {
  const currentMenu = useContext(CurrentMenuStateContext);
  const setCurrentMenu = useContext(CurrentMenuDispatchContext);
  const menuId = useRef();

  const handleCurrentMenu = e => {
    e.stopPropagation();
    if (currentMenu === `nav-${menuId.current}`) {
      setCurrentMenu(null);
    } else {
      setCurrentMenu(`nav-${menuId.current}`);
    }
  };

  useEffect(() => {
    if (item.type === 'submenu') {
      menuId.current = uuid();
    }
  }, [item.type]);

  return (
    item.type === 'link' || item.type === 'linkExternal' ? (
      <Link
        nav
        navMain={navMain}
        as={
          item.type === 'text' ? 'span'
          : item.type === 'linkExternal' ? 'a'
          : null
        }
        to={item.type === 'link' ? item.url : null}
        href={item.type === 'linkExternal' ? item.url : null}
        style={{ whiteSpace: 'nowrap' }}
        desktopOnly={item.desktopOnly}
      >
        {item.text}
      </Link>

    ) : item.type === 'button' ? (
      <Button
        gray
        text
        onClick={item.onClick}
        style={{ whiteSpace: 'nowrap' }}
        desktopOnly={item.desktopOnly}
      >
        {item.text}
      </Button>

    ) : item.type === 'text-large' ? (
      <SubmenuTextLarge>
        {item.text}
      </SubmenuTextLarge>

    ) : item.type === 'text' ? (
      <SubmenuText>
        {item.text}
      </SubmenuText>

    ) : item.type === 'horizontal-rule' ? (
      <Hr />

    ) : item.type === 'submenu' ? (
      <SubmenuContainer desktopOnly={item.desktopOnly}>
        <Button
          gray
          text
          onClick={handleCurrentMenu}
          desktopOnly={item.desktopOnly}
        >
          {item.text}
        </Button>
        {currentMenu === `nav-${menuId.current}` && (
          <Submenu onClick={e => e.stopPropagation()}>
            {item.content.map((subItem, i) => (
              subItem.type === 'text-large' ? (
                <SubmenuTextLarge key={i}>{subItem.text}</SubmenuTextLarge>
              ) : subItem.type === 'text' ? (
                <SubmenuText key={i}>{subItem.text}</SubmenuText>
              ) : subItem.type === 'horizontal-rule' ? (
                <Hr key={i} />
              ) : subItem.type === 'link' || subItem.type === 'button' ? (
                <NavItem key={i} item={subItem} />
              ) : (
                <p>{subItem.text}</p>
              )
            ))}
          </Submenu>
        )}
      </SubmenuContainer>
    ) : item.type === 'image-link' ? (
      <ReactRouterLink to={item.url}>
        <img src={item.image} alt="link-img" />
      </ReactRouterLink>
    ) : (
      <span>{item.text}</span>
    )
  );
};

export default NavItem;
