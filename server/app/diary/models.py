from pathlib import Path

import uuid6
from django.db import models


def get_random_filename(_instance, filename):
    # 元のファイルの拡張子を取得
    ext = Path(filename).suffix
    # ランダムなUUIDを生成し、拡張子を付与
    random_filename = f"{uuid6.uuid7().hex}{ext}"
    # 保存先のパスを指定
    return Path("uploads") / random_filename


class DiaryEntry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid6.uuid7, editable=False)
    image = models.ImageField(upload_to=get_random_filename)
    original_image = models.ImageField(upload_to=get_random_filename)
    title = models.CharField(max_length=100)
    text = models.TextField()
    public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Diary Entry {self.id} - {self.created_at}"


class PageImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid6.uuid7, editable=False)
    diary = models.ForeignKey(DiaryEntry, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=get_random_filename)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Page Image {self.id} - {self.created_at}"
