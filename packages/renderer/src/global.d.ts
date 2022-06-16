import { AxiosResponse } from 'axios';
import { BrowserWindow } from 'electron';

export {};

declare global {
  interface Window {
    // Expose some Api through preload script
    fs: typeof import('fs');
    ipcRenderer: import('electron').IpcRenderer;
    removeLoading: () => void;
    electron: {
      openNewWindow: (path: string = '', options?: BrowserWindowConstructorOptions) => void;
    };
  }
}
