from django.urls import path
from .views import (
    PostLikeView,
    FollowUserView,
    FollowersListView,
    FollowingListView,
    FollowCountsView,
)

urlpatterns = [
    path("posts/<uuid:post_id>/like/", PostLikeView.as_view(), name="post-like"),
    path("users/<uuid:user_id>/follow/", FollowUserView.as_view(), name="follow-user"),
    path("users/<uuid:user_id>/followers/", FollowersListView.as_view(), name="followers-list"),
    path("users/<uuid:user_id>/following/", FollowingListView.as_view(), name="following-list"),
    path("users/<uuid:user_id>/counts/", FollowCountsView.as_view(), name="follow-counts"),
]
