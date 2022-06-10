import { AxiosResponse } from 'axios';

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

export type TResponseResult<T> = AxiosResponse<{
  errorCode: string;
  errorMsg: string;
  resultBody: Array<T>;
  status: number;
}>;


export type Brand = {
  title: string;
  price: number;
  quantity: number;
};

export type Coin = {
  nomial: number;
  quantity: number;
};