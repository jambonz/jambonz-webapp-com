import { createContext, useState, useEffect } from "react";

export const ResponsiveContext = createContext();

export function ResponsiveProvider(props) {
  const [mobileInfo, setMobileInfo] = useState(false);

  const screenSizeChanged = () => {
    const { width } = window.screen;
    let breakPoint = process.env.REACT_APP_MOBILE_BREAKPOINT;
    breakPoint = breakPoint ? parseInt(breakPoint.replace("px", ""), 10) : 767;
    setMobileInfo({
      isMobile: width < breakPoint,
      width
    });
  };

  useEffect(() => {
    window.addEventListener("resize", screenSizeChanged);

    screenSizeChanged();

    return () => {
      window.removeEventListener("resize", screenSizeChanged);
    };
  }, []);

  return (
    <ResponsiveContext.Provider value={mobileInfo}>
      {props.children}
    </ResponsiveContext.Provider>
  );
}
