from rest_framework import serializers

class DiaryEntryCreateSerializer(serializers.Serializer):
    image = serializers.ImageField(required=True)
    enable_ai = serializers.BooleanField(required=True)
    image_filter = serializers.ChoiceField(choices=["blur", "illustration_style", "hue_inversion", "posterization", "original"], required=True)

    def validate(self, data):
        # カスタムバリデーション（例: 画像サイズ制限）
        image = data.get('image')
        if image.size > 5 * 1024 * 1024:  # 5MB制限
            raise serializers.ValidationError("Image size must be less than 5MB.")

        return data