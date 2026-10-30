import uuid
import httpx

from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed


class SupabaseUser:
    """Represents an authenticated Supabase user in Django."""

    def __init__(self, user_data):
        self.id = uuid.UUID(user_data["id"])
        self.username = user_data.get("email", "")
        self.email = user_data.get("email", "")
        self.user_metadata = user_data.get("user_metadata", {}) or {}
        self.is_authenticated = True
        self.is_anonymous = False
        self.is_active = True

    def __str__(self):
        return str(self.id)


import time

_token_cache = {}  # {token: (user_data, expire_ts)}
_http_client = httpx.Client(timeout=10.0)


class SupabaseJWTAuthentication(BaseAuthentication):

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization", "")

        if not auth_header:
            return None

        parts = auth_header.split()

        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise AuthenticationFailed("Invalid authorization header.")

        token = parts[1]

        # Check short-lived cache (60 seconds) to eliminate network latency & timeouts
        now = time.time()
        cached = _token_cache.get(token)
        if cached:
            user_data, expire_ts = cached
            if now < expire_ts:
                return (SupabaseUser(user_data), token)
            else:
                _token_cache.pop(token, None)

        if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
            raise AuthenticationFailed("Supabase authentication is not configured.")

        try:
            response = _http_client.get(
                f"{settings.SUPABASE_URL.rstrip('/')}/auth/v1/user",
                headers={
                    "apikey": settings.SUPABASE_ANON_KEY,
                    "Authorization": f"Bearer {token}",
                },
            )

            if response.status_code != 200:
                raise AuthenticationFailed("Invalid or expired Supabase access token.")

            user_data = response.json()

            if not user_data.get("id"):
                raise AuthenticationFailed("Invalid Supabase user response.")

            # Cache verified token for 60 seconds
            _token_cache[token] = (user_data, now + 60)

            return (SupabaseUser(user_data), token)

        except httpx.TimeoutException:
            raise AuthenticationFailed("Supabase authentication timed out.")

        except httpx.RequestError:
            raise AuthenticationFailed("Unable to contact Supabase authentication.")

        except (ValueError, KeyError, TypeError):
            raise AuthenticationFailed("Invalid Supabase user data.")

    def authenticate_header(self, request):
        return "Bearer"


