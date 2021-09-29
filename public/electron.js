const log = require('electron-log');
const packageJson = require('../package.json')
log.transports.file.level = 'info'
log.transports.file.level = 'info'
Object.assign(console, log.functions);

const Sentry = require("@sentry/node");
const os = require("os");
const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const isDev = require("electron-is-dev");
const path = require("path");
process.env.DATA_DIR = app.getPath("userData");
const server = require("../server");

let mainWindow;
const sentryOptions = {
  serverName: os.hostname(),
  environment: isDev ? 'dev' : 'production',
  initialScope: {
    user: {
      name: `${os.userInfo().username}@${os.hostname()}`
    },
    tags: {
      arch: os.arch(),
      platform: os.platform(),
      type: os.type(),
    }
  },
  release: `${packageJson.name}@${packageJson.version}${isDev ? '-dev' : ''}`,
};

Sentry.init({
  ...sentryOptions,
  dsn: "https://30dca3c2643e4891b1af4f454fcb9d53@o1017083.ingest.sentry.io/5982657"
});

const sentryOSContext = {
  arch: os.arch(),
  freemem: os.freemem(),
  platform: os.platform(),
  totalmem: os.totalmem(),
  type: os.type(),
  uptime: os.uptime(),
  version: os.version(),
};

Sentry.setContext("OS", sentryOSContext);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js"), // use a preload script
    },
  });

  const startUrl = "http://localhost:8999";
  (async function () {
    await server.start();
    mainWindow.loadURL(startUrl);
    mainWindow.maximize();
  })();

  // Open the DevTools.
  if (isDev && false) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  mainWindow.on("closed", async function () {
    mainWindow = null;
    await server.close();
  });

  mainWindow.once("ready-to-show", () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("app_version", (event) => {
  event.sender.send("app_version", { version: app.getVersion() });
});

ipcMain.on("sentry_init", (event) => {
  event.sender.send("sentry_init", sentryOptions);
  event.sender.send("sentry_set_context", "OS", sentryOSContext);
});

autoUpdater.on("update-available", () => {
  mainWindow.webContents.send("update_available");
});
autoUpdater.on("update-downloaded", () => {
  mainWindow.webContents.send("update_downloaded");
});

ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});
