const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const spawn = require('child_process').spawn;

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 800,
    height: 600
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  // mainWindow.webContents.openDevTools();
  mainWindow.on('closed', function () {
    mainWindow = null;
    const killnode = spawn('taskkill', ['/im', 'node.exe'], { cwd: process.cwd() });
  })
}

app.on('ready', createWindow);
app.on('browser-window-created', function (e, window) {
  window.setMenu(null);
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
