from PIL import Image, ImageFilter, ImageOps, ImageEnhance
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys

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
    original_format = pil_image.format if pil_image.format else 'JPEG'

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
        raise ValueError("Invalid image filter")

    # メモリ上に画像を保存
    buffer = BytesIO()
    filtered_image.save(buffer, format=original_format)
    buffer.seek(0)

    # InMemoryUploadedFile に変換
    filtered_image_file = InMemoryUploadedFile(
        buffer,
        None,
        f"filtered_{image.name}",
        f"image/{original_format.lower()}",
        sys.getsizeof(buffer),
        None
    )

    return filtered_image_file
