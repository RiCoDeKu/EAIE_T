# diary/views.py

import base64
from io import BytesIO

from django.core.files.storage import default_storage
from django.shortcuts import get_object_or_404, render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import DiaryEntry, PageImage
from .serializers import DiaryEntryCreateSerializer

from .utils import apply_filter, get_ai_response, predict_weather


class DiaryEntryCreateAPIView(APIView):
    def post(self, request):
        # リクエストから画像データを取得
        image_file = request.FILES.get("image")
        if not image_file:
            return Response({"error": "Image file is required."}, status=status.HTTP_400_BAD_REQUEST)

        # 画像データをコピーしてBase64エンコーディング
        image_copy = BytesIO(image_file.read())
        image_file.seek(0)  # 元の画像データのポインタをリセット
        base64_encoded = base64.b64encode(image_copy.read()).decode("utf-8")

        serializer = DiaryEntryCreateSerializer(data=request.data)
        if serializer.is_valid():
            # 画像の保存
            image = serializer.validated_data["image"]
            enable_ai = serializer.validated_data["enable_ai"]
            image_filter = serializer.validated_data["image_filter"]

            original_image = image
            filtered_image = apply_filter(image, image_filter)

            title = "テキストを入力してください"
            diary_text = "テキストを入力してください"

            if enable_ai:
                json_data = get_ai_response(base64_encoded)
                title = json_data["title"]
                diary_text = json_data["comment"]
                ### AIの処理終了

			# 天気予測
            weather_prediction = predict_weather(image)
            
            # データベースに保存
            diary_entry = DiaryEntry.objects.create(
                image=filtered_image, original_image=original_image, title=title, text=diary_text
            )

            # レスポンスデータの準備
            image_url = default_storage.url(diary_entry.image.name)
            image_full_url = request.build_absolute_uri(image_url)

            response_data = {
                "id": diary_entry.id,
                "title": diary_entry.title,
                "image_url": image_full_url,
                "text": diary_entry.text,
                "created_at": diary_entry.created_at,
                "weather_prediction": weather_prediction,
            }
            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DiaryEntryDetailAPIView(APIView):
    def put(self, request, diary_entry_id):
        diary_entry = get_object_or_404(DiaryEntry, id=diary_entry_id)
        text = request.data.get("text", "")
        title = request.data.get("title", "")
        created_at = request.data.get("created_at", diary_entry.created_at)
        image_filter = request.data.get("image_filter", "original")
        weather_prediction = request.data.get("weather_prediction", "")

        if image_filter != "":
            filtered_image = apply_filter(diary_entry.original_image, image_filter)
        else:
            filtered_image = diary_entry.image

        diary_entry.text = text
        diary_entry.image = filtered_image
        diary_entry.title = title
        diary_entry.created_at = created_at
        diary_entry.public = True
        diary_entry.weather_prediction = weather_prediction
        diary_entry.save()

        image_url = default_storage.url(diary_entry.image.name)
        image_full_url = request.build_absolute_uri(image_url)

        response_data = {
            "id": diary_entry.id,
            "title": diary_entry.title,
            "image_url": image_full_url,
            "text": diary_entry.text,
            "created_at": diary_entry.created_at,
            "weather_prediction": diary_entry.weather_prediction,
        }
        return Response(response_data, status=status.HTTP_200_OK)


class DiaryEntryAPIView(APIView):
    def get(self, request):
        diary_entries = DiaryEntry.objects.filter(public=True)
        response_data = []
        for diary_entry in diary_entries:
            image_url = default_storage.url(diary_entry.image.name)
            image_full_url = request.build_absolute_uri(image_url)
            response_data.append(
                {
                    "id": diary_entry.id,
                    "title": diary_entry.title,
                    "image_url": image_full_url,
                    "text": diary_entry.text,
                    "created_at": diary_entry.created_at,
                    "weather_prediction": diary_entry.weather_prediction,
                }
            )
        return Response(response_data, status=status.HTTP_200_OK)


class DiaryEntryPageImageAPIView(APIView):
    def get(self, request):
        page_images = PageImage.objects.all()
        response_data = []
        for page_image in page_images:
            if page_image.diary.public is False:
                continue
            image_url = default_storage.url(page_image.image.name)
            image_full_url = request.build_absolute_uri(image_url)
            response_data.append(
                {
                    "diary_id": page_image.diary.id,
                    "image_url": image_full_url,
                }
            )
        return Response(response_data, status=status.HTTP_200_OK)

    def post(self, request):
        diary_id = request.data.get("diary_id")
        image = request.data.get("image")
        diary = get_object_or_404(DiaryEntry, id=diary_id)
        page_image = PageImage.objects.create(diary=diary, image=image)

        image_url = default_storage.url(page_image.image.name)
        image_full_url = request.build_absolute_uri(image_url)

        response_data = {
            "diary_id": page_image.diary.id,
            "image_url": image_full_url,
        }
        return Response(response_data, status=status.HTTP_201_CREATED)

    def put(self, request):
        diary_id = request.data.get("diary_id")
        image = request.data.get("image")
        diary = get_object_or_404(DiaryEntry, id=diary_id)
        page_image = get_object_or_404(PageImage, diary=diary)
        page_image.image = image
        page_image.save()

        image_url = default_storage.url(page_image.image.name)
        image_full_url = request.build_absolute_uri(image_url)

        response_data = {
            "diary_id": page_image.diary.id,
            "image_url": image_full_url,
        }
        return Response(response_data, status=status.HTTP_200_OK)


# デバッグ用のビュー
def debug_view(request):
    return render(request, "diary/debug.html")
