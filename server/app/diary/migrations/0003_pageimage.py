# Generated by Django 5.1.3 on 2024-11-19 05:16

import diary.models
import django.db.models.deletion
import uuid6
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('diary', '0002_diaryentry_original_image_diaryentry_public_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='PageImage',
            fields=[
                ('id', models.UUIDField(default=uuid6.uuid7, editable=False, primary_key=True, serialize=False)),
                ('image', models.ImageField(upload_to=diary.models.get_random_filename)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('diary', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='diary.diaryentry')),
            ],
        ),
    ]
