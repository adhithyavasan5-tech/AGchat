import uuid
from django.db import models
from django.db.models import F, Q


class Like(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(
        "posts.Post",
        on_delete=models.CASCADE,
        related_name="likes"
    )
    user_id = models.UUIDField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "likes"
        constraints = [
            models.UniqueConstraint(
                fields=["post", "user_id"],
                name="unique_user_post_like"
            )
        ]

    def __str__(self):
        return f"Like by {self.user_id}"


class Follower(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    follower_id = models.UUIDField(db_index=True)
    following_id = models.UUIDField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "followers"
        constraints = [
            models.UniqueConstraint(
                fields=["follower_id", "following_id"],
                name="unique_follower_relationship"
            ),
            models.CheckConstraint(
                condition=~Q(follower_id=F("following_id")),
                name="prevent_self_follow"
            )
        ]

    def __str__(self):
        return f"{self.follower_id} follows {self.following_id}"
