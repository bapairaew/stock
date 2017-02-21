const electron = require('electron');
const ps = require('ps-node');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

const spawn = require('child_process').spawn;

let mainWindow;
const pids = [];

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
  })
}

ipc.on('pid-message', function (e, arg) {
  console.log('pid: ', arg);
  pids.push(arg);
});

app.on('ready', createWindow);
app.on('browser-window-created', function (e, window) {
  window.setMenu(null);
});

app.on('before-quit', function() {
  pids.forEach(pid => {
    console.log('killing: ', pid);
    ps.kill(pid, err => {
      if (err) throw new Error(err);
      console.log('Process %s has been killed!', pid);
    });
  });
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
