from django.urls import path

from .views import DiaryEntryAPIView, DiaryEntryCreateAPIView, DiaryEntryDetailAPIView, debug_view

urlpatterns = [
    path("", DiaryEntryAPIView.as_view(), name="diary-entry"),
    path("create/", DiaryEntryCreateAPIView.as_view(), name="create-diary-entry"),
    path("<uuid:diary_entry_id>/", DiaryEntryDetailAPIView.as_view(), name="diary-entry-detail"),
    path("debug/", debug_view, name="debug"),
]
