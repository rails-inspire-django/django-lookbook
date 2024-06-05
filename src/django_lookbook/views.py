import inspect
import json
import time
import urllib.parse
from pathlib import Path

from django.conf import settings
from django.http import Http404
from django.shortcuts import render
from django.template.loader import select_template
from django.urls import reverse
from django_viewcomponent.app_settings import app_settings
from django_viewcomponent.preview import ViewComponentPreview

from django_lookbook.preview import LookbookPreview

cached_previews = None
cached_sidebar_previews = None


class PreviewGroup:
    def __init__(self, group_name):
        self.group_name = group_name
        self.previews = {}


def remove_docstring_indentation(func):
    docstrings = inspect.getdoc(func)
    if not docstrings:
        return ""

    lines = docstrings.split("\n")
    if not lines:
        return None

    # Find the common leading whitespace
    leading_space = min(
        len(line) - len(line.lstrip()) for line in lines if line.strip()
    )

    # Remove the common leading whitespace
    cleaned_docstring = "\n".join(line[leading_space:] for line in lines)

    return cleaned_docstring


def request_get_to_dict(request):
    """
    Convert request.GET to a dictionary
    """
    query_dict = request.GET
    return {
        key: query_dict.getlist(key)
        if len(query_dict.getlist(key)) > 1
        else query_dict.get(key)
        for key in query_dict
    }


def get_previews():
    global cached_previews  # noqa

    # Check if previews are already calculated
    if cached_previews is not None:
        return cached_previews

    new_previews = {}

    # for ViewComponentPreview
    for key, value in ViewComponentPreview.previews.items():
        new_key = key.replace("_component", "")
        new_previews[new_key] = value

    # for LookbookPreview
    for key, value in LookbookPreview.previews.items():
        new_previews[key] = value

    cached_previews = new_previews
    return new_previews


def get_sidebar_previews():
    base_dir = Path(settings.BASE_DIR)
    preview_base_ls = [base_dir / p for p in app_settings.PREVIEW_BASE]

    global cached_sidebar_previews  # noqa

    if cached_sidebar_previews is not None:
        return cached_sidebar_previews

    new_previews = {}

    for key, value in ViewComponentPreview.previews.items():
        preview_path = value.preview_view_component_path

        for base in preview_base_ls:
            if str(preview_path).startswith(str(base)):
                relative_preview_path = Path(preview_path).relative_to(base)
                num_levels = len(relative_preview_path.parts)
                if num_levels == 1:
                    new_key = key.replace("_component", "")
                    new_previews[new_key] = value
                else:
                    group_name = relative_preview_path.parts[0]
                    # check if new_previews contains the group or not
                    if group_name in new_previews:
                        group = new_previews[group_name]
                        new_key = key.replace("_component", "")
                        group.previews[new_key] = value
                    else:
                        group = PreviewGroup(group_name)
                        new_previews[group_name] = group
                        new_key = key.replace("_component", "")
                        group.previews[new_key] = value

                break

    for key, value in LookbookPreview.previews.items():
        preview_path = value.preview_view_component_path

        for base in preview_base_ls:
            if str(preview_path).startswith(str(base)):
                relative_preview_path = Path(preview_path).relative_to(base)
                num_levels = len(relative_preview_path.parts)
                if num_levels == 1:
                    new_key = key
                    new_previews[new_key] = value
                else:
                    group_name = relative_preview_path.parts[0]
                    # check if new_previews contains the group or not
                    if group_name in new_previews:
                        group = new_previews[group_name]
                        new_key = key
                        group.previews[new_key] = value
                    else:
                        group = PreviewGroup(group_name)
                        new_previews[group_name] = group
                        new_key = key
                        group.previews[new_key] = value

                break

    cached_sidebar_previews = new_previews
    return new_previews


def build_search_param_value(data):
    """
    Same as buildSearchParamValue in the frontend
    """
    str_data = json.dumps(data, separators=(",", ":"))
    return urllib.parse.quote(str_data)


def index_view(request):
    sidebar_previews = get_sidebar_previews()
    previews = get_previews()

    context = {
        "previews": previews,
        "sidebar_previews": sidebar_previews,
    }

    return render(request, "django_lookbook/index.html", context)


def inspect_view(request, slug):
    sidebar_previews = get_sidebar_previews()

    preview_name, example_name = slug.split("/")

    preview_cls = get_previews()[preview_name.replace("_component", "")]
    preview_instance = preview_cls()

    query_dict = request_get_to_dict(request)
    fun = getattr(preview_instance, example_name, None)
    if fun is None:
        return render(
            request,
            "django_lookbook/404.html",
            context={
                "sidebar_previews": sidebar_previews,
                "previews": get_previews(),
            },
            status=404,
        )

    preview_html = fun(**query_dict)

    method = getattr(preview_instance, example_name)
    preview_source = inspect.getsource(method)
    # remove docstring
    if fun.__doc__ is not None:
        preview_source = preview_source.replace(fun.__doc__, "").replace('""""""', "")

    # remove 4 spaces from the beginning of each line
    lines = preview_source.split("\n")
    modified_lines = [line[4:] for line in lines]
    cleaned_preview_source = "\n".join(modified_lines)

    form_class = getattr(fun, "form_class", None)
    form = None if form_class is None else form_class(request.GET or None)

    display_theme = request.COOKIES.get("display-theme", "light")
    timestamp = int(time.time() * 1000)
    query_params = request.GET.copy()
    query_params["timestamp"] = timestamp
    query_params["display"] = build_search_param_value(
        {"theme": display_theme},
    )
    query_string = query_params.urlencode()
    absolute_preview_url_with_query = (
        request.build_absolute_uri(reverse("django_lookbook:preview", args=[slug]))
        + "?"
        + query_string
    )

    context = {
        "sidebar_previews": sidebar_previews,
        "preview_instance": preview_instance,
        "preview_html": preview_html.strip(),
        "preview_source": cleaned_preview_source,
        "previews": get_previews(),
        "doc": remove_docstring_indentation(fun),
        "form": form,
        "absolute_preview_url": absolute_preview_url_with_query,
    }

    return render(request, "django_lookbook/inspect.html", context)


def preview_view(request, slug):
    display_value = request.GET.get("display", "{}")
    decoded_display_value = urllib.parse.unquote(display_value)
    try:
        display_dict = json.loads(decoded_display_value)
        theme = display_dict.get("theme", "light")
    except json.JSONDecodeError:
        theme = "light"

    preview_name, example_name = slug.split("/")

    preview_cls = get_previews()[preview_name.replace("_component", "")]
    preview_instance = preview_cls()

    query_dict = request_get_to_dict(request)
    fun = getattr(preview_instance, example_name, None)
    if fun is None:
        raise Http404

    preview_html = fun(**query_dict)

    context = {
        "preview_instance": preview_instance,
        "preview_html": preview_html,
        "preview_source": "",
        "theme": theme,
    }
    template_names = [
        "django_lookbook/preview.html",
        "django_viewcomponent/preview.html",
    ]
    template = select_template(template_names)
    return render(request, template.template.name, context)
