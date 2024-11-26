# Create your tests here.
import copy
import io

from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from PIL import Image
from rest_framework import status
from rest_framework.test import APITestCase


def generate_test_image():
    """
    テスト用の画像を生成してバイナリデータを返す
    """
    # 100x100 の赤い画像を生成
    image = Image.new("RGB", (100, 100), color="red")
    byte_arr = io.BytesIO()  # バイナリデータを格納するバッファ
    image.save(byte_arr, format="JPEG")  # バッファに画像をJPEG形式で保存
    byte_arr.seek(0)  # バッファの先頭に戻る
    return byte_arr


class DiaryEntryCreateAPITestCase(APITestCase):
    def setUp(self):
        self.dummy_image_data = generate_test_image()
        self.dummy_image = SimpleUploadedFile(
            name="test_image.jpg",
            content=self.dummy_image_data.getvalue(),
            content_type="image/jpeg",
        )
        self.url = reverse("diary:create-diary-entry")

    def test_post(self):
        filter_list = ["blur", "illustration_style", "hue_inversion", "posterization", "original"]

        for filter_name in filter_list:
            image = copy.deepcopy(self.dummy_image)
            data = {
                "image": image,
                "enable_ai": True,
                "image_filter": filter_name,
            }
            response = self.client.post(self.url, data, format="multipart")
            assert response.status_code == status.HTTP_201_CREATED
