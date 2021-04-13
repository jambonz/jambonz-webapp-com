import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components/macro";
import { CurrentMenuProvider } from "./contexts/CurrentMenuContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ModalProvider } from "./contexts/ModalContext";
import { ResponsiveProvider } from "./contexts/ResponsiveContext";
import Routes from "./Routes";
import "antd/dist/antd.css";
import "./global-styles.css";

const theme = {
  mobileOnly: `@media (max-width: ${process.env.REACT_APP_MOBILE_BREAKPOINT})`,
  externalMaxWidth: "32rem",
};

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CurrentMenuProvider>
      <NotificationProvider>
        <ModalProvider>
          <ResponsiveProvider>
            <Routes />
          </ResponsiveProvider>
        </ModalProvider>
      </NotificationProvider>
    </CurrentMenuProvider>
  </ThemeProvider>,
  document.getElementById("root")
);
