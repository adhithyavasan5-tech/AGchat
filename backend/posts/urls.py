from django.urls import path

from .views import (
    PostFeedView,
    UserPostsView,
    PostDetailView,
    PostImageUploadView,
)

urlpatterns = [
    path("", PostFeedView.as_view(), name="post-feed"),
    path("upload/", PostImageUploadView.as_view(), name="post-image-upload"),
    path("user/<uuid:user_id>/", UserPostsView.as_view(), name="user-posts"),
    path("<uuid:pk>/", PostDetailView.as_view(), name="post-detail"),
]