import os
from typing import BinaryIO
from uuid import uuid4
import ffmpeg

from django.core.files.storage import FileSystemStorage

from electron_django_example.settings import BASE_DIR


class FileService:
    def __init__(self) -> None:
        self.fs = FileSystemStorage()

    def save_file(self, file: BinaryIO) -> str:
        video_path = self.fs.save(f"{os.path.abspath(BASE_DIR)}/resources/{uuid4().hex}_{file.name}", file)

        return video_path
    
    def delete_file(self, video_path: str):
        self.fs.delete(video_path)
        

class FfmpegService:
    def get_audio(self, video_path: str, output_path: str) -> str:
        (
            ffmpeg
            .input(video_path)
            .output(output_path, acodec='pcm_s16le', ac=1, ar='16k', f='wav')
            .overwrite_output()
            .run()
        )

        return output_path

    def fade_in(self, video_path: str, output_path: str, fade_duration: int=5) -> str:
        (
            ffmpeg
            .input(video_path)
            .output(output_path, vf=f'setpts=PTS-STARTPTS, fade=t=in:st=0:d={fade_duration}, fade=t=out:st=50:d={fade_duration}', vcodec='libx264')
            .overwrite_output()
            .run()
        )

        return output_path
