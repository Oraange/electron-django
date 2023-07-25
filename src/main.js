const { app, BrowserWindow, ipcMain } = require("electron");
const path = require('path');
const { startDjangoServer } = require("./index.js");
const { autoUpdater } = require("electron-updater");

const createWindow = () => {
    const win = new BrowserWindow({
        width: 640,
        height: 480,
        fullscreen: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('./src/index.html');
    win.webContents.openDevTools();
};

app.whenReady().then(() => {
    createWindow();
    startDjangoServer();
    autoUpdater.checkForUpdatesAndNotify();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.on("app_version", (event) => {
    event.sender.send("app_version", { version: app.getVersion() });
});

autoUpdater.on("update-available", () => {
    win.webContents.send("update-available");
});

autoUpdater.on("update-downloaded", () => {
    win.webContents.send("update_downloaded");
});

ipcMain.on("restart_app", () => {
    autoUpdater.quitAndInstall();
});
