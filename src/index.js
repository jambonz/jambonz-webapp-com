import React from 'react';
import ReactDOM from 'react-dom';
import './global-styles.css';
import { NotificationProvider } from './contexts/NotificationContext';
import { ModalProvider } from './contexts/ModalContext';
import Routes from './Routes';

ReactDOM.render(
  <NotificationProvider>
    <ModalProvider>
      <Routes />
    </ModalProvider>
  </NotificationProvider>,
  document.getElementById('root')
);
