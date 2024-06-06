import glob
import importlib
import importlib.util
import sys
from pathlib import Path


def autodiscover_previews():
    from .app_settings import app_settings

    if app_settings.SHOW_PREVIEWS:
        preview_base_ls = [Path(p) for p in app_settings.PREVIEW_BASE]
        for directory in preview_base_ls:
            for path in glob.iglob(str(directory / "**/*.py"), recursive=True):
                import_component_file(path)


def import_component_file(path):
    MODULE_PATH = path
    MODULE_NAME = Path(path).stem
    spec = importlib.util.spec_from_file_location(MODULE_NAME, MODULE_PATH)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
