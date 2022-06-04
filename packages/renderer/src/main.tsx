import React from 'react';
import ReactDOM from 'react-dom';
import { GeistProvider, CssBaseline } from '@geist-ui/core';
import App from './App';

import 'virtual:windi.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

window.removeLoading && window.removeLoading();

// Usage of ipcRenderer.on
window.ipcRenderer &&
  window.ipcRenderer.on('main-process-message', (_event, ...args) => {
    console.log('[Receive Main-process message]:', ...args);
  });
