from django.db import models


class Profile(models.Model):
    # Same UUID as the corresponding Supabase Auth user
    id = models.UUIDField(primary_key=True)
    username = models.CharField(max_length=30, unique=True)
    full_name = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(max_length=2048, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "profiles"
        ordering = ["username"]

    def __str__(self):
        return self.username
