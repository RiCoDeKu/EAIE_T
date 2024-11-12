# diary/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from django.views.generic import TemplateView
import os
from .models import DiaryEntry
from .serializers import DiaryEntrySerializer

class DiaryEntryCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = DiaryEntrySerializer(data=request.data)
        if serializer.is_valid():
            # 画像の保存
            image = serializer.validated_data['image']


            ### AIの処理開始
            # ここでAIのカラム処理を行い，テキスト生成，画像加工を行う ###

            # 画像の加工（例として何もしない）
            new_image = image
            # 画像から日記のテキストを生成（例として固定文を使用）
            diary_text = "今日の夕暮れ、ふと海辺に立ち寄ると、美しい風景が広がっていました。"

            ### AIの処理終了

            # データベースに保存
            diary_entry = DiaryEntry.objects.create(image=image, text=diary_text)

            # レスポンスデータの準備
            image_url = default_storage.url(diary_entry.image.name)

            response_data = {
                "image_url": image_url,
                "text": diary_text
            }
            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# デバッグ用のビュー
from django.shortcuts import render

def debug_view(request):
    return render(request, 'diary/debug.html')
