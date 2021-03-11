import ReactDOM from "react-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "./global-styles.css";
import { ThemeProvider } from "styled-components/macro";
import { CurrentMenuProvider } from "./contexts/CurrentMenuContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ModalProvider } from "./contexts/ModalContext";
import Routes from "./Routes";

const stripePromise = loadStripe("pk_test_EChRaX9Tjk8csZZVSeoGqNvu00lsJzjaU0");

const theme = {
  mobileOnly: `@media (max-width: ${process.env.REACT_APP_MOBILE_BREAKPOINT})`,
  externalMaxWidth: "32rem",
};

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CurrentMenuProvider>
      <NotificationProvider>
        <ModalProvider>
          <Elements stripe={stripePromise}>
            <Routes />
          </Elements>
        </ModalProvider>
      </NotificationProvider>
    </CurrentMenuProvider>
  </ThemeProvider>,
  document.getElementById("root")
);
