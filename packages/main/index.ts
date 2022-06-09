import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  BrowserWindowConstructorOptions,
} from 'electron'
import { release } from 'os'
import { join } from 'path'
import installExtension, { REDUX_DEVTOOLS } from 'electron-devtools-installer'
import Store from 'electron-store'
import axios from 'axios'
import 'v8-compile-cache'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null

Store.initRenderer()

async function createWindow(
  path = '',
  options?: BrowserWindowConstructorOptions
) {
  win = new BrowserWindow({
    title: 'Star6ucks',
    width: 450,
    height: 700,
    resizable: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
      preload: join(__dirname, '../preload/index.cjs'),
    },
    ...options,
  })

  if (app.isPackaged) {
    win.loadFile(join(__dirname, `../renderer/index.html`), {
      hash: path || undefined,
    })
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}/#${path}`

    win.loadURL(url)
    win.webContents.openDevTools()
  }

  // Test active push message to Renderer-process
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

let serverProcess: any
const SPRING_PORT = 8081

function startSpringServer(port: number | string) {
  const JAR = 'api.jar' 
  console.info(`Starting server at port ${port}`)
  const server = (() => {
    if (!app.isPackaged) {
      return join(process.cwd(), 'libraries', JAR)
    }
    return join(process.resourcesPath, '..', 'libraries', JAR)
  })()
  console.info(`Launching server with jar ${server} at port ${port}...`)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  serverProcess = require('child_process').spawn('java', [
    '-jar',
    server,
    `--server.port=${port}`,
  ])

  if (serverProcess.pid) {
    console.info('Server PID: ' + serverProcess.pid)
  } else {
    console.error('Failed to launch server process.')
  }
}

function stopSpringServer(port: number | string) {
  const baseUrl = `http://localhost:${port}`
  console.info('Stopping server...')
  return axios
    .post(`${baseUrl}/actuator/shutdown`, null, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then(() => console.info('Server stopped'))
    .catch((error) => {
      console.error('Failed to stop the server gracefully.', error)
      if (serverProcess) {
        console.info(`Killing server process ${serverProcess.pid}`)
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const kill = require('tree-kill')
        kill(serverProcess.pid, 'SIGTERM', function (err: any) {
          console.info('Server process killed', err)
          serverProcess = null
          app.quit() // quit again
        })
      }
    })
    .finally(() => {
      serverProcess = null
      app.quit() // quit again
    })
}

app
  .whenReady()
  .then(() => startSpringServer(SPRING_PORT))
  .then(() => {
    installExtension(REDUX_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err))
  })
  .then(() => createWindow())

app.on('window-all-closed', async () => {
  await stopSpringServer(SPRING_PORT)
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// new window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (app.isPackaged) {
    childWindow.loadFile(join(__dirname, `../renderer/index.html`), {
      hash: `${arg}`,
    })
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}/#${arg}`
    childWindow.loadURL(url)
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
})
