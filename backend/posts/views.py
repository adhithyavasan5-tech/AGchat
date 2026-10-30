from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

from accounts.storage import upload_image

from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Post
from .serializers import PostSerializer
from .permissions import IsOwnerOrReadOnly


class PostFeedView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by("-created_at")
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user.id)


class UserPostsView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Post.objects.filter(
            user_id=self.kwargs["user_id"]
        ).order_by("-created_at")


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsOwnerOrReadOnly]
    http_method_names = ["get", "patch", "delete", "head", "options"]
class PostImageUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        uploaded_file = request.FILES.get("image")

        if not uploaded_file:
            raise ValidationError("Please provide a post image.")

        image_url = upload_image(
            uploaded_file=uploaded_file,
            user_id=request.user.id,
            folder="posts",
        )

        return Response({
            "message": "Post image uploaded successfully.",
            "image_url": image_url,
        })
