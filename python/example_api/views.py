import traceback
from typing import Any
import ffmpeg
import os

from django.http import HttpRequest
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .service import FfmpegService, FileService
from electron_django_example.settings.product import BASE_DIR


class EdtwViewSet(viewsets.ViewSet):
    @action(methods=['GET'], detail=False, name='Get Value from input')
    def get_val_from(self, request):
        input = request.GET['input']

        return Response({"input": input}, status=status.HTTP_200_OK, content_type="application/json")


class GetAudioViewSet(viewsets.ViewSet):
    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        self.file_service = FileService()
        self.ffmpeg_service = FfmpegService()

    def create(self, request: HttpRequest):
        file = request.FILES.get('file')
        video_path = self.file_service.save_file(file=file)
        audio_path = f"{os.path.abspath(BASE_DIR)}/resources/{os.path.basename(video_path).split('.')[0]}.wav"

        try:
            result = self.ffmpeg_service.get_audio(video_path, audio_path)
            self.file_service.delete_file(video_path)
            return Response({"message": "OK", "path": result}, status=status.HTTP_201_CREATED)

        except ffmpeg.Error:
            return Response({"error": "FFMPEG Error", "message": f"{traceback.format_exc()}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FadeInOut(viewsets.ViewSet):
    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        self.file_service = FileService()
        self.ffmpeg_service = FfmpegService()

    @action(methods=['POST'], detail=False)
    def create(self, request: HttpRequest):
        file = request.FILES.get('file')
        video_path = self.file_service.save_file(file)
        output_path = f"{os.path.abspath(BASE_DIR)}/resources/output.mp4"

        try:
            result = self.ffmpeg_service.fade_in(video_path=video_path, output_path=output_path)
            return Response({"message": "OK", "path": result}, status=status.HTTP_201_CREATED)
        
        except ffmpeg.Error:
            return Response({"error": "FFMPEG Error", "message": f"{traceback.format_exc()}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
