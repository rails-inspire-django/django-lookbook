from django.conf import settings


class AppSettings:
    def __init__(self):
        self.settings = getattr(settings, "LOOKBOOK", {})

    @property
    def PREVIEW_BASE(self):
        from django_viewcomponent.app_settings import (
            app_settings as view_component_settigs,
        )

        if "preview_base" in self.settings:
            return self.settings["preview_base"]
        else:
            return view_component_settigs.PREVIEW_BASE

    @property
    def SHOW_PREVIEWS(self):
        from django_viewcomponent.app_settings import (
            app_settings as view_component_settigs,
        )

        if "show_previews" in self.settings:
            return self.settings["show_previews"]
        else:
            return view_component_settigs.SHOW_PREVIEWS


app_settings = AppSettings()
