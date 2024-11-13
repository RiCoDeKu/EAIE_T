from django.urls import path
from .views import DiaryEntryCreateView
from .views import debug_view

urlpatterns = [
    path('create/', DiaryEntryCreateView.as_view(), name='create-diary-entry'),
    path('debug/', debug_view, name='debug'),
]