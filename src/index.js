import ReactDOM from 'react-dom';
import './global-styles.css';
import { ThemeProvider } from 'styled-components/macro';
import { CurrentMenuProvider } from './contexts/CurrentMenuContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ModalProvider } from './contexts/ModalContext';
import Routes from './Routes';

const theme = {
  mobileOnly: `@media (max-width: ${process.env.REACT_APP_MOBILE_BREAKPOINT})`,
  externalMaxWidth: '32rem',
};

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CurrentMenuProvider>
      <NotificationProvider>
        <ModalProvider>
          <Routes />
        </ModalProvider>
      </NotificationProvider>
    </CurrentMenuProvider>
  </ThemeProvider>,
  document.getElementById('root')
);
