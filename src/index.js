import ReactDOM from 'react-dom';
import './global-styles.css';
import { CurrentMenuProvider } from './contexts/CurrentMenuContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ModalProvider } from './contexts/ModalContext';
import Routes from './Routes';

ReactDOM.render(
  <CurrentMenuProvider>
    <NotificationProvider>
      <ModalProvider>
        <Routes />
      </ModalProvider>
    </NotificationProvider>
  </CurrentMenuProvider>,
  document.getElementById('root')
);
