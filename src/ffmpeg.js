import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';


const file = document.querySelector('input[type="file"]');

/////////////////////////////
const testBtn = document.getElementById('testBtn')
testBtn.addEventListener('click', async (e) => {
    const res = await axios.get(`http://127.0.0.1:8000/example_api/get_val_from/?input=${testBtn.innerText}`)
    const result = res.data

    if (result) {
        console.log(result.input)
    }
})

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
    console.log("result: ", result, "\npath: ", document.getElementById('audioPlayer').src)
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
});
