import re
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response

from .storage import upload_image
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError

from .models import Profile
from .serializers import ProfileSerializer


def get_or_create_profile(user):
    existing = Profile.objects.filter(id=user.id).first()

    if existing:
        return existing

    email_name = getattr(user, "email", "") or ""
    base = email_name.split("@")[0].lower()
    base = re.sub(r"[^a-z0-9_]", "_", base).strip("_")
    base = (base or "user")[:22]

    # Add part of the Supabase UUID to keep generated usernames unique.
    username = f"{base}_{str(user.id).replace('-', '')[:6]}"

    metadata = getattr(user, "user_metadata", {}) or {}
    full_name = metadata.get("full_name", "") or metadata.get("name", "")

    profile, created = Profile.objects.get_or_create(
        id=user.id,
        defaults={
            "username": username,
            "full_name": str(full_name)[:100],
        },
    )

    return profile


class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "patch", "head", "options"]

    def get_object(self):
        try:
            return get_or_create_profile(self.request.user)
        except Exception as exc:
            raise ValidationError("Unable to load or create your profile.") from exc


class PublicProfileView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]
    lookup_field = "username"

    def get_object(self):
        import uuid
        lookup = self.kwargs.get(self.lookup_field, "")
        try:
            val = uuid.UUID(str(lookup))
            profile = Profile.objects.filter(id=val).first()
            if profile:
                return profile
        except (ValueError, AttributeError):
            pass
        from django.shortcuts import get_object_or_404
        return get_object_or_404(Profile, username=lookup)
class AvatarUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        uploaded_file = request.FILES.get("image")

        if not uploaded_file:
            raise ValidationError("Please provide an image.")

        profile = get_or_create_profile(request.user)

        image_url = upload_image(
            uploaded_file=uploaded_file,
            user_id=request.user.id,
            folder="avatars",
        )

        profile.avatar_url = image_url
        profile.save(update_fields=["avatar_url", "updated_at"])

        return Response({
            "message": "Avatar uploaded successfully.",
            "avatar_url": profile.avatar_url,
        })
