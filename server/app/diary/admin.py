# Register your models here.
from django.contrib import admin

from .models import DiaryEntry, PageImage

admin.site.register(DiaryEntry)
admin.site.register(PageImage)
