import fs from 'fs';
import { BrowserWindowConstructorOptions, contextBridge, ipcRenderer } from 'electron';
import { domReady } from './utils';
import { useLoading } from './loading';
import { Titlebar, Color } from 'custom-electron-titlebar';
import pkg from '../../package.json'

const { appendLoading, removeLoading } = useLoading();

(async () => {
  await domReady();
  appendLoading();
})();

window.addEventListener('DOMContentLoaded', () => {
  // Title bar implemenation
  if (pkg.env.STAR6UCKS_CUSTOM_TITLEBAR) {
    new Titlebar({
      backgroundColor: Color.fromHex('#eeeeee'),
    });
  }
});

// --------- Expose some API to the Renderer process. ---------
export const electron = {
  openNewWindow: (path: string = '', options?: BrowserWindowConstructorOptions) =>
    ipcRenderer.send('window:open', path, options),
};

contextBridge.exposeInMainWorld('electron', electron)

contextBridge.exposeInMainWorld('fs', fs);
contextBridge.exposeInMainWorld('removeLoading', removeLoading);
contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer));

// contextBridge.exposeInMainWorld('store', withPrototype(store))

// `exposeInMainWorld` can't detect attributes and methods of `prototype`, manually patching it.
function withPrototype(obj: Record<string, any>) {
  const protos = Object.getPrototypeOf(obj);

  for (const [key, value] of Object.entries(protos)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) continue;

    if (typeof value === 'function') {
      // Some native APIs, like `NodeJS.EventEmitter['on']`, don't work in the Renderer process. Wrapping them into a function.
      obj[key] = function (...args: any) {
        return value.call(obj, ...args);
      };
    } else {
      obj[key] = value;
    }
  }
  return obj;
}
