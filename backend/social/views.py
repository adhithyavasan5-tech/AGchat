from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from django.db import IntegrityError, transaction

from posts.models import Post
from accounts.models import Profile
from .models import Like, Follower


class PostLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)

        like, created = Like.objects.get_or_create(
            post=post,
            user_id=request.user.id
        )

        return Response({
            "liked": True,
            "created": created,
            "like_count": Like.objects.filter(post=post).count()
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def delete(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)

        deleted, _ = Like.objects.filter(
            post=post,
            user_id=request.user.id
        ).delete()

        return Response({
            "liked": False,
            "deleted": deleted > 0,
            "like_count": Like.objects.filter(post=post).count()
        })


class FollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        target = get_object_or_404(Profile, id=user_id)

        if target.id == request.user.id:
            raise ValidationError("You cannot follow yourself.")

        try:
            with transaction.atomic():
                relationship, created = Follower.objects.get_or_create(
                    follower_id=request.user.id,
                    following_id=target.id
                )
        except IntegrityError:
            created = False

        return Response({
            "following": True,
            "created": created,
            "follower_count": Follower.objects.filter(
                following_id=target.id
            ).count()
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def delete(self, request, user_id):
        target = get_object_or_404(Profile, id=user_id)

        deleted, _ = Follower.objects.filter(
            follower_id=request.user.id,
            following_id=target.id
        ).delete()

        return Response({
            "following": False,
            "deleted": deleted > 0,
            "follower_count": Follower.objects.filter(
                following_id=target.id
            ).count()
        })


class FollowersListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        get_object_or_404(Profile, id=user_id)

        follower_ids = Follower.objects.filter(
            following_id=user_id
        ).values_list("follower_id", flat=True)

        profiles = Profile.objects.filter(id__in=follower_ids).order_by("username")

        return Response({
            "count": profiles.count(),
            "results": [
                {
                    "id": str(profile.id),
                    "username": profile.username,
                    "full_name": profile.full_name,
                    "avatar_url": profile.avatar_url
                }
                for profile in profiles
            ]
        })


class FollowingListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        get_object_or_404(Profile, id=user_id)

        following_ids = Follower.objects.filter(
            follower_id=user_id
        ).values_list("following_id", flat=True)

        profiles = Profile.objects.filter(id__in=following_ids).order_by("username")

        return Response({
            "count": profiles.count(),
            "results": [
                {
                    "id": str(profile.id),
                    "username": profile.username,
                    "full_name": profile.full_name,
                    "avatar_url": profile.avatar_url
                }
                for profile in profiles
            ]
        })


class FollowCountsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        get_object_or_404(Profile, id=user_id)

        return Response({
            "followers": Follower.objects.filter(
                following_id=user_id
            ).count(),
            "following": Follower.objects.filter(
                follower_id=user_id
            ).count()
        })
