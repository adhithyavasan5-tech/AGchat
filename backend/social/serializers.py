from rest_framework import serializers
from .models import Like, Follower


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ["id", "post", "user_id", "created_at"]
        read_only_fields = ["id", "user_id", "created_at"]


class FollowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follower
        fields = ["id", "follower_id", "following_id", "created_at"]
        read_only_fields = ["id", "follower_id", "created_at"]
