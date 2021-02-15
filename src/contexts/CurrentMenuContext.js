import { createContext, useState, useEffect } from 'react';

export const CurrentMenuStateContext = createContext();
export const CurrentMenuDispatchContext = createContext();

/*
 * This context keeps track of which menu is currently open.
 * You can only have one menu open at a time, and different
 * menus are spread across the application (navigation,
 * bulk edit menus, and menus in table rows)
 */

export function CurrentMenuProvider(props) {

  const [ currentMenu, setCurrentMenu ] = useState(null);

  useEffect(() => {
    const hideMenu = () => setCurrentMenu(null);
    window.addEventListener('click', hideMenu);
    return () => window.removeEventListener('click', hideMenu);
  }, [setCurrentMenu]);

  return (
    <CurrentMenuStateContext.Provider value={currentMenu}>
      <CurrentMenuDispatchContext.Provider value={setCurrentMenu}>
        {props.children}
      </CurrentMenuDispatchContext.Provider>
    </CurrentMenuStateContext.Provider>
  );
};
