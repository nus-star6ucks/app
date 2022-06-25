import {
  app,
  BrowserWindow,
  shell,
  screen,
  ipcMain,
  BrowserWindowConstructorOptions,
} from 'electron';
import { release } from 'os';
import { join } from 'path';
import { unlinkSync } from 'fs';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import axios from 'axios';
import 'v8-compile-cache';

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(
  urlPath = '',
  options?: BrowserWindowConstructorOptions
): BrowserWindow {
  win = new BrowserWindow({
    title: 'Star6ucks',
    width: 450,
    height: 700,
    resizable: false,
    maximizable: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
      allowRunningInsecureContent: true,
    },
    ...options,
  });

  win.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      callback({ requestHeaders: { Origin: '*', ...details.requestHeaders } });
    }
  );

  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        'Access-Control-Allow-Origin': ['*'],
        ...details.responseHeaders,
      },
    });
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL(`http://localhost:4200/#/${urlPath}`);
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    win.loadURL(
      url.format({
        pathname: path.join(__dirname, pathIndex),
        protocol: 'file:',
        slashes: true,
        hash: `/${urlPath}`,
      })
    );
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

let serverProcess: any;
const SPRING_PORT = 8081;

function startSpringServer(port: number | string) {
  const JAR = 'api.jar';
  console.info(`Starting server at port ${port}`);
  const server = (() => {
    if (!app.isPackaged) {
      return join(process.cwd(), 'libraries', JAR);
    }
    return join(process.resourcesPath, '..', 'libraries', JAR);
  })();
  console.info(`Launching server with jar ${server} at port ${port}...`);

  serverProcess = require('child_process').spawn('java', [
    '-jar',
    server,
    `--server.port=${port}`,
  ]);

  if (serverProcess.pid) {
    console.info('Server PID: ' + serverProcess.pid);
  } else {
    console.error('Failed to launch server process.');
  }
}

function stopSpringServer(port: number | string) {
  const baseUrl = `http://localhost:${port}`;
  console.info('Stopping server...');
  return axios
    .post(`${baseUrl}/actuator/shutdown`, null, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then(() => console.info('Server stopped'))
    .catch(error => {
      console.error('Failed to stop the server gracefully.', error);
      if (serverProcess) {
        console.info(`Killing server process ${serverProcess.pid}`);

        const kill = require('tree-kill');
        kill(serverProcess.pid, 'SIGTERM', function (err: any) {
          console.info('Server process killed', err);
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

try {
  app
    .whenReady()
    .then(() => startSpringServer(SPRING_PORT))
    .then(() => createWindow());

  // Quit when all windows are closed.
  app.on('window-all-closed', async () => {
    await stopSpringServer(SPRING_PORT);
    unlinkSync(join(process.cwd(), 'api/db', 'vmcs.mv.db'));
    win = null;

    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  ipcMain.handle('close-other-wins', () => {
    BrowserWindow.getAllWindows().forEach(win => {
      if (win.id > 1) {
        win.close();
      }
    });
  });

  ipcMain.handle('refresh-all-states', () => {
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send('refresh-all-states');
    });
  });

  ipcMain.handle('refresh-user-states', () => {
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send('refresh-user-states');
    });
  });

  ipcMain.handle('refresh-coin-states', () => {
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send('refresh-coin-states');
    });
  });

  ipcMain.handle('refresh-machine-states', () => {
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send('refresh-machine-states');
    });
  });

  ipcMain.handle('refresh-drink-states', () => {
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send('refresh-drink-states');
    });
  });

  ipcMain.handle(
    'open-win',
    (event, path, options?: BrowserWindowConstructorOptions) => {
      const childWindow = createWindow(path, options);
    }
  );
} catch (e) {
  // Catch Error
  // throw e;
}
