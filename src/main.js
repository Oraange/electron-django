const { app, BrowserWindow, ipcMain } = require("electron");
const path = require('path');
const { startDjangoServer } = require("./index.js");
const { autoUpdater } = require("electron-updater");
const treeKill = require("tree-kill");

let DJANGO_CHILD_PROCESS = null;
let win;

const createWindow = () => {
    win = new BrowserWindow({
        width: 640,
        height: 480,
        fullscreen: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            contentSecurityPolicy: "default-src '*';"
        }
    });

    win.loadFile('./src/index.html');
    win.webContents.openDevTools();
};

app.whenReady().then(() => {
    createWindow();
    DJANGO_CHILD_PROCESS = startDjangoServer();
    autoUpdater.checkForUpdatesAndNotify();

    ipcMain.on('message-from-renderer', (event, arg) => {
        console.log(arg);

        win.webContents.send('message-from-main', 'This is a message from the main process!')
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('before-quit', async function () {
    treeKill( DJANGO_CHILD_PROCESS.pid );
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
    treeKill( DJANGO_CHILD_PROCESS.pid );
});

ipcMain.on("app_version", (event) => {
    event.sender.send("app_version", { version: app.getVersion() });
});

autoUpdater.on("update_available", () => {
    win.webContents.send("update_available");
});

autoUpdater.on("update_downloaded", () => {
    win.webContents.send("update_downloaded");
});

ipcMain.on("restart_app", () => {
    autoUpdater.quitAndInstall();
});
