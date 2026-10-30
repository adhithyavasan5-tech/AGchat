from django.urls import path
from .views import PostCommentsView, CommentDetailView

urlpatterns = [
    path("posts/<uuid:post_id>/", PostCommentsView.as_view(), name="post-comments"),
    path("<uuid:comment_id>/", CommentDetailView.as_view(), name="comment-detail"),
]
