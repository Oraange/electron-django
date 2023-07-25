import { ipcRenderer } from 'electron';
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';

console.log('👋 This message is being logged by "renderer.js"')


const version = document.querySelector("#version")

ipcRenderer.send("app_version");
ipcRenderer.on("app_version", (event, data) => {
    ipcRenderer.removeAllListeners("app_version");
    version.innerHTML = `현재 버전: ${data.version}`
});

const notification = document.querySelector(".notification");
const message = document.querySelector(".update-message");
const closeButton = document.querySelector("#close-button");
const restartButton = document.querySelector("#restart-button");

ipcRenderer.on("update_available", () => {
    ipcRenderer.removeAllListeners("update_available");
    message.innerText = "업데이트 파일을 다운로드 중입니다...";
    notification.classList.remove("hidden");
});

// update_downloaded 채널로 송/수신
ipcRenderer.on("update_downloaded", () => {
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





const file = document.querySelector('input[type="file"]');

document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.getElementById('videoPlayer');

    file.addEventListener('change', () => {
        playVideo(file.files[0], videoPlayer);
    });
});

const playVideo = (file, videoPlayer) => {
    videoPlayer.src = URL.createObjectURL(file);
    videoPlayer.play();
};

document.getElementById('btnGetAudio').addEventListener('click', async (e) => {
    e.preventDefault();

    if (file.files['length'] === 0) {
        console.log("파일이 존재하지 않습니다.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file.files[0]);

    const res = await axios.post("http://127.0.0.1:8000/get-audio", formData, {"headers": "multipart/form-data"});
    const result = res.data.path

    document.getElementById('audio_output').innerHTML = result;
    document.getElementById('audioPlayer').src = result;
});

document.getElementById('btnFadeIn').addEventListener('click', async (e) => {
    e.preventDefault();

    if (file.files['length'] === 0) {
        console.log("파일이 존재하지 않습니다.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file.files[0])

    const res = await axios.post("http://127.0.0.1:8000/fade-in", formData, {"headers": "multipart/form-data"});
    const result = res.data.path

    const videoPlayer = document.getElementById('videoPlayer-fade');
    videoPlayer.src = result
    videoPlayer.play()
    // playVideo(result, videoPlayer)
})
