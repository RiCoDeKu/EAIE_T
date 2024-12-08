import json
import sys
from io import BytesIO

from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile
from openai import OpenAI
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

def apply_filter(image, image_filter):
    """
    Apply the specified filter to the input image and return it as an InMemoryUploadedFile.
    Args:
        image: The uploaded image file.
        image_filter: A string specifying the filter to apply.
    Returns:
        filtered_image_file: The processed image as an InMemoryUploadedFile.
    """
    pil_image = Image.open(image)

    # 元の画像形式を取得
    original_format = pil_image.format if pil_image.format else "JPEG"

    # フィルタ処理
    if image_filter == "blur":
        filtered_image = pil_image.filter(ImageFilter.GaussianBlur(10))

    elif image_filter == "illustration_style":
        edges = pil_image.filter(ImageFilter.CONTOUR)
        filtered_image = ImageEnhance.Brightness(edges).enhance(1.5)

    elif image_filter == "hue_inversion":
        filtered_image = ImageOps.invert(pil_image.convert("RGB"))

    elif image_filter == "posterization":
        filtered_image = ImageOps.posterize(pil_image.convert("RGB"), 3)

    elif image_filter == "original":
        filtered_image = pil_image

    else:
        error_messsage = f"Invalid image filter: {image_filter}"
        raise ValueError(error_messsage)

    # メモリ上に画像を保存
    buffer = BytesIO()
    filtered_image.save(buffer, format=original_format)
    buffer.seek(0)

    # InMemoryUploadedFile に変換
    return InMemoryUploadedFile(
        buffer, None, f"filtered_{image.name}", f"image/{original_format.lower()}", sys.getsizeof(buffer), None
    )

client = OpenAI(
    api_key=settings.OPENAI_API_KEY,
)

prompt = """
タイトルと100文字くらいの日記を以下のjson形式で出力して
{
    "title": "title",
    "comment": "The person is relaxing and not engaged in studying activities."
}

Notes:
- Confirm that data = json.loads(your response) does not produce an error.
- Do not format the response as a code block, such as in markdown.
"""


def get_ai_response(base64_image: str) -> dict:
    """Get AI response from OpenAI API."""

    if not settings.OPENAI_API_KEY:
        return {"title": "OpenAI APIキーが設定されていません", "comment": "OpenAI APIキーを設定してください。"}

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{base64_image}", "detail": "low"},
                    },
                ],
            }
        ],
        max_tokens=300,
    )
    data = response.choices[0].message.content
    if data is not None:
        return json.loads(data)
    return {"title": "生成に失敗!", "comment": "AIから適切なレスポンスを得られませんでした。"}

def predict_weather(image):
    """
    Predict the weather based on the average pixel value of the image.
    Args:
        image: The uploaded image file.
    Returns:
        weather: A string representing the predicted weather.
    """
    pil_image = Image.open(image)
    pil_image = pil_image.convert("RGB")
    pixels = list(pil_image.getdata())
    avg_pixel_value = sum(sum(pixel) for pixel in pixels) / len(pixels) / 3

    if avg_pixel_value < 85:
        return "rainy"
    elif avg_pixel_value < 170:
        return "cloudy"
    else:
        return "sunny"
