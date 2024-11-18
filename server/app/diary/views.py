# diary/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from django.shortcuts import get_object_or_404

from .utils import apply_filter
import os
from .models import DiaryEntry
from .serializers import DiaryEntryCreateSerializer

class DiaryEntryCreateAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = DiaryEntryCreateSerializer(data=request.data)
        if serializer.is_valid():
            # 画像の保存
            image = serializer.validated_data['image']
            enable_ai = serializer.validated_data['enable_ai']
            image_filter = serializer.validated_data['image_filter']

            original_image = image
            filtered_image = apply_filter(image, image_filter)
            title = ""
            diary_text = ""

            if enable_ai:
                ### AIの処理開始
                # 日記のタイトルを生成
                title = "夕暮れの海辺"
                # 日記のテキストを生成
                diary_text = "今日の夕暮れ、ふと海辺に立ち寄ると、美しい風景が広がっていました。"

                ### AIの処理終了

            # データベースに保存
            diary_entry = DiaryEntry.objects.create(
                image=filtered_image,
                original_image=original_image,
                title=title,
                text=diary_text
            )

            # レスポンスデータの準備
            image_url = default_storage.url(diary_entry.image.name)
            image_full_url = request.build_absolute_uri(image_url)

            response_data = {
                "id": diary_entry.id,
                "title": diary_entry.title,
                "image_url": image_full_url,
                "text": diary_entry.text,
                "created_at": diary_entry.created_at
            }
            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DiaryEntryDetailAPIView(APIView):
    def put(self, request, diary_entry_id):
        diary_entry = get_object_or_404(DiaryEntry, id=diary_entry_id)
        text = request.data.get('text', "")
        title = request.data.get('title', "")
        created_at = request.data.get('created_at', diary_entry.created_at)
        image_filter = request.data.get('image_filter', "original")
        
        if image_filter != "":
            filtered_image = apply_filter(diary_entry.original_image, image_filter)
        else :
            filtered_image = diary_entry.image

        diary_entry.text = text
        diary_entry.image = filtered_image
        diary_entry.title = title
        diary_entry.created_at = created_at
        diary_entry.public = True
        diary_entry.save()
        
        image_url = default_storage.url(diary_entry.image.name)
        image_full_url = request.build_absolute_uri(image_url)

        response_data = {
            "id": diary_entry.id,
            "title": diary_entry.title,
            "image_url": image_full_url,
            "text": diary_entry.text,
            "created_at": diary_entry.created_at
        }
        return Response(response_data, status=status.HTTP_200_OK)
    
class DiaryEntryAPIView(APIView):
    def get(self, request):
        diary_entries = DiaryEntry.objects.filter(public=True)
        response_data = []
        for diary_entry in diary_entries:
            image_url = default_storage.url(diary_entry.image.name)
            image_full_url = request.build_absolute_uri(image_url)
            response_data.append({
                "id": diary_entry.id,
                "title": diary_entry.title,
                "image_url": image_full_url,
                "text": diary_entry.text,
                "created_at": diary_entry.created_at
            })
        return Response(response_data, status=status.HTTP_200_OK)


# デバッグ用のビュー
from django.shortcuts import render

def debug_view(request):
    return render(request, 'diary/debug.html')
