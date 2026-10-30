from django.urls import path

from .views import (
    MyProfileView,
    PublicProfileView,
    AvatarUploadView,
)

urlpatterns = [
    path("me/", MyProfileView.as_view(), name="my-profile"),
    path("profiles/<str:username>/", PublicProfileView.as_view(), name="public-profile"),
    path("me/avatar/", AvatarUploadView.as_view(), name="avatar-upload"),
]
