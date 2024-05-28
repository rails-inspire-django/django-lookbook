from django.urls import include, path

urlpatterns = [
    path("previews/", include("django_viewcomponent.urls")),
    path("lookbook/", include("django_lookbook.urls")),
]
