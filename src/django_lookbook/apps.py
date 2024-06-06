from django.apps import AppConfig


class LookbookConfig(AppConfig):
    name = "django_lookbook"

    def ready(self):
        self.module.autodiscover_previews()
