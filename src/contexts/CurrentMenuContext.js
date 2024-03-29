import { createContext, useState, useEffect } from 'react';

export const CurrentMenuStateContext = createContext();
export const CurrentMenuDispatchContext = createContext();

/*
 * This context keeps track of which menu is currently open.
 * You can only have one menu open at a time, and different
 * menus are spread across the application (navigation,
 * table rows menus, bulk edit menus)
 */

export function CurrentMenuProvider(props) {

  const [ currentMenu, setCurrentMenu ] = useState(null);
  const hideMenu = () => setCurrentMenu(null);

  // Hide any open menu on mouse click
  useEffect(() => {
    window.addEventListener('click', hideMenu);
    return () => window.removeEventListener('click', hideMenu);
  }, [setCurrentMenu]);

  // Hide any open menu when resizing across mobile/desktop breakpoint
  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${process.env.REACT_APP_MOBILE_BREAKPOINT}`);
    mediaQuery.addListener(hideMenu);
    return () => mediaQuery.removeListener(hideMenu);
  }, [setCurrentMenu]);

  return (
    <CurrentMenuStateContext.Provider value={currentMenu}>
      <CurrentMenuDispatchContext.Provider value={setCurrentMenu}>
        {props.children}
      </CurrentMenuDispatchContext.Provider>
    </CurrentMenuStateContext.Provider>
  );
};
