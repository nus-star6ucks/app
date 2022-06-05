import { app, BrowserWindow, shell, ipcMain, nativeTheme, Tray, Menu, Notification  } from 'electron';
import { release } from 'os';
import { join } from 'path';
import Store from 'electron-store';
import './samples/npm-esm-packages';
import pkg from '../../package.json'
import logger from 'electron-log';
import axios from 'axios';

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension: any, REACT_DEVELOPER_TOOLS: any, REDUX_DEVTOOLS: any; // NEW!
if (!app.isPackaged) {
  const devTools = require('electron-devtools-installer');
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
  REDUX_DEVTOOLS = devTools.REDUX_DEVTOOLS;
}

const { setupTitlebar, attachTitlebarToWindow } = require('custom-electron-titlebar/main');

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;

const store = new Store();
if (pkg.env.STAR6UCKS_CUSTOM_TITLEBAR) setupTitlebar();

const JAR = 'spring.jar'; // how to avoid manual update of this?

// The server url and process
let serverProcess: any;
const SPRING_PORT = 8081;
const baseUrl = `http://localhost:${SPRING_PORT}`;

function logServer(data: any) {
  // data is from server std.out and may includes multiple lines
  const messages = data.toString().split('\n');
  messages.forEach((msg: string) => {
    if (msg.length > 0) {
      if (msg.startsWith('INFO')) logger.info(msg.substring(6));
      else if (msg.startsWith('WARN')) logger.warn(msg.substring(6));
      else if (msg.startsWith('ERROR')) logger.error(msg.substring(6));
      else if (msg.startsWith('DEBUG')) logger.debug(msg.substring(6));
      else logger.silly(msg);
    }
  });
}

function startSpringServer(port: number | string) {
  logger.info(`Starting server at port ${port}`);
  const server = (() => {
    if (!app.isPackaged) {
      return join(process.cwd(), 'libraries', JAR);
    }
    return join(process.resourcesPath, '..', 'libraries', JAR);
  })();
  logger.info(`Launching server with jar ${server} at port ${port}...`);
  serverProcess = require('child_process').spawn('java', ['-jar', server, `--server.port=${port}`]);

  serverProcess.stdout.on('data', logServer);

  if (serverProcess.pid) {
    logger.info('Server PID: ' + serverProcess.pid);
  } else {
    logger.error('Failed to launch server process.');
  }
}

function stopSpringServer() {
  logger.info('Stopping server...');
  axios
    .post(`${baseUrl}/actuator/shutdown`, null, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then(() => logger.info('Server stopped'))
    .catch((error) => {
      logger.error('Failed to stop the server gracefully.', error);
      if (serverProcess) {
        logger.info(`Killing server process ${serverProcess.pid}`);
        const kill = require('tree-kill');
        kill(serverProcess.pid, 'SIGTERM', function (err: any) {
          logger.info('Server process killed', err);
          serverProcess = null;
          app.quit(); // quit again
        });
      }
    })
    .finally(() => {
      serverProcess = null;
      app.quit(); // quit again
    });
}

async function createWindow() {
  let windowState: any = await store.get('windowState');
  if (!pkg.env.STAR6UCKS_SAVE_WINDOWSIZE) windowState = null;
  win = new BrowserWindow({
    title: 'Star6ucks',
    show: false,
    autoHideMenuBar: pkg.env.STAR6UCKS_CUSTOM_TITLEBAR,
    titleBarStyle: pkg.env.STAR6UCKS_CUSTOM_TITLEBAR ? 'hidden' : 'default',
    x: windowState?.x || 0,
    y: windowState?.y || 0,
    width: windowState?.width || 600,
    height: windowState?.height || 850,
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
    },
  });

  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../renderer/index.html'));
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`;

    win.loadURL(url);
    if (!app.isPackaged) win.webContents.openDevTools({ mode: 'detach' });
  }

  // Test active push message to Renderer-process
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  win.on('close', () => {
    const windowState = win?.getBounds();
    if (pkg.env.STAR6UCKS_SAVE_WINDOWSIZE) store.set('windowState', windowState);
  });

  win.once('ready-to-show', () => {
    win?.show();
  });

  if (pkg.env.STAR6UCKS_CUSTOM_TITLEBAR) attachTitlebarToWindow(win);
}

function showNotification(title: string, body: string) {
  new Notification({ title, body }).show();
}

app
  .whenReady()
  .then(() => startSpringServer(SPRING_PORT))
  .then(createWindow)
  .then(async () => {
    if (!app.isPackaged) {
      await installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS], {
        loadExtensionOptions: { allowFileAccess: true },
        forceDownload: false,
      })
        .then((name: any) => console.log(`Added Extension:  ${name}`))
        .catch((error: any) => console.log(`An error occurred: , ${error}`));
    }
  });

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

app.on('will-quit', (e) => {
  stopSpringServer();
});

ipcMain.on('set', async (event, arg) => {
  console.log(arg[0], arg[1]);
  await store.set(arg[0], arg[1]);
  event.sender.send('ping-pong', `[ipcMain] "${arg}" received asynchronously.`);
});

ipcMain.on('get', async (event, arg) => {
  const res: any = await store.get(arg);
  event.sender.send('get', res);
});

ipcMain.on('ping-pong', async (event, arg) => {
  event.sender.send('ping-pong', `[ipcMain] "${arg}" received asynchronously.`);
});

ipcMain.on('ping-pong-sync', (event, arg) => {
  event.returnValue = `[ipcMain] "${arg}" received synchronously.`;
});
