const { ipcRenderer } = require('electron');

console.log('👋 This message is being logged by "renderer.js"')
console.log(process.env.NODE_ENV)

const version = document.querySelector("#version")

document.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send('message-from-renderer', 'Hello, this is a message from the renderer process!');

    ipcRenderer.on('message-from-main', (event, arg) => { console.log(arg) });
})

ipcRenderer.send("app_version");
ipcRenderer.on("app_version", (event, data) => {
    ipcRenderer.removeAllListeners("app_version");
    version.innerHTML = `현재 버전: ${data.version}`
});

const notification = document.querySelector(".notification");
const message = document.querySelector(".update-message");
const closeButton = document.querySelector("#close-button");
const restartButton = document.querySelector("#restart-button");

ipcRenderer.on("update-available", () => {
    ipcRenderer.removeAllListeners("update_available");
    message.innerText = "업데이트 파일을 다운로드 중입니다...";
    notification.classList.remove("hidden");
});

// update_downloaded 채널로 송/수신
ipcRenderer.on("update-downloaded", () => {
    ipcRenderer.removeAllListeners("update_downloaded");
    message.innerText = "업데이트 파일 다운로드를 마쳤습니다.\n재시작을 하면 업데이트 버전이 실행됩니다.\n재시작 하시겠습니까?";
    restartButton.classList.remove("hidden");
    notification.classList.remove("hidden");
});

function closeNotification() {
    notification.classList.add("hidden");
}

function restartApp() {
    ipcRenderer.send("restart_app");
}

closeButton.addEventListener("click", closeNotification);
restartButton.addEventListener("click", restartApp);
