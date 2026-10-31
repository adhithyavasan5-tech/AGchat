
import uuid
import logging

from django.conf import settings
from rest_framework.exceptions import ValidationError
from supabase import create_client

logger = logging.getLogger(__name__)

ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/pjpeg": ".jpg",
    "image/png": ".png",
    "image/x-png": ".png",
    "image/webp": ".webp",
}

MAX_FILE_SIZE = 5 * 1024 * 1024

# Change this only after checking the exact bucket name in Supabase.
BUCKET_NAME = "cichat-media"


def upload_image(uploaded_file, user_id, folder):
    if uploaded_file.size > MAX_FILE_SIZE:
        raise ValidationError("Image must be smaller than 5 MB.")

    content_type = (uploaded_file.content_type or "").strip().lower()

    if content_type not in ALLOWED_TYPES:
        raise ValidationError("Only JPEG, PNG and WebP images are allowed.")

    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        logger.error("Supabase Storage configuration is missing.")
        raise ValidationError("Image storage is not configured.")

    extension = ALLOWED_TYPES[content_type]
    file_name = f"{uuid.uuid4()}{extension}"
    storage_path = f"{folder}/{user_id}/{file_name}"

    try:
        supabase = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY,
        )

        file_bytes = uploaded_file.read()

        result = supabase.storage.from_(BUCKET_NAME).upload(
            path=storage_path,
            file=file_bytes,
            file_options={
                "content-type": content_type,
                "upsert": "false",
            },
        )

        public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(
            storage_path
        )

        logger.info("Image uploaded successfully: %s", storage_path)

        return public_url

    except Exception:
        logger.exception(
            "Supabase image upload failed. Bucket=%s Path=%s",
            BUCKET_NAME,
            storage_path,
        )
        raise ValidationError(
            "Image upload failed. Check the backend logs."
        )
