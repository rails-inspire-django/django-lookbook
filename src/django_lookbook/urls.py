from django.urls import path

from .views import index_view, inspect_view, preview_view

app_name = "django_lookbook"

urlpatterns = [
    path("", index_view, name="index"),
    path("inspect/<path:slug>/", inspect_view, name="inspect"),
    path("preview/<path:slug>/", preview_view, name="preview"),
]
