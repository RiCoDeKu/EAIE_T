from django.db import models
import uuid6
import os

def get_random_filename(instance, filename):
    # 元のファイルの拡張子を取得
    ext = os.path.splitext(filename)[1]
    # ランダムなUUIDを生成し、拡張子を付与
    random_filename = f'{uuid6.uuid7().hex}{ext}'
    # 保存先のパスを指定
    return os.path.join('uploads/', random_filename)

class DiaryEntry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid6.uuid7, editable=False)
    image = models.ImageField(upload_to=get_random_filename)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Diary Entry {self.id} - {self.created_at}"



