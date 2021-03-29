import { createContext, useState, useEffect } from "react";

export const ResponsiveContext = createContext();

export function ResponsiveProvider(props) {
  const [isMobile, setIsMobile] = useState(false);

  const screenSizeChanged = () => {
    const { width } = window.screen;
    let breakPoint = process.env.REACT_APP_MOBILE_BREAKPOINT;
    breakPoint = breakPoint ? parseInt(breakPoint.replace("px", ""), 10) : 767;
    setIsMobile(width < breakPoint);
  };

  useEffect(() => {
    window.addEventListener("resize", screenSizeChanged);

    screenSizeChanged();

    return () => {
      window.removeEventListener("resize", screenSizeChanged);
    };
  });

  return (
    <ResponsiveContext.Provider value={isMobile}>
      {props.children}
    </ResponsiveContext.Provider>
  );
}
