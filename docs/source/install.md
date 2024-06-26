# Installation

```{note}
If you already used `django-viewcomponent`, you can follow the [Installation with django-viewcomponent](install_with_viewcomponent.md).
```

```shell
$ pip install django-lookbook
```

Then add the app into `INSTALLED_APPS` in settings.py

```python
INSTALLED_APPS = [
    ...,
    "django_lookbook",
]
```

Add code below in settings.py

```python
LOOKBOOK = {
    # we will put previews in this directory later
    "preview_base": ["previews"],
    # show_previews is True by default
    "show_previews": DEBUG,
}

# to make iframe work
X_FRAME_OPTIONS = "SAMEORIGIN"
```

Notes:

1. `preview_base` is the base path for your previews.
2. `show_previews` is a boolean value, which is used to control whether to show the previews. It is `True` by default, here we set it with same value of `DEBUG`. So the previews will only be shown in the development environment.

Update urls.py

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("lookbook/", include("django_lookbook.urls")),        # new
]
```

Next, let's create *previews/template_preview.py*

```python
from django_lookbook.preview import LookbookPreview
from django.template import Context, Template
from django.template.loader import render_to_string


class PartialTemplatesPreview(LookbookPreview):

    def header(self, **kwargs):
        """
        `includes/header.html` is a partial template, we can write preview for it in this way.
        
        **Markdown syntax is supported in docstring**
        """
        return render_to_string("includes/header.html")

    def footer(self, **kwargs):
        """
        We can write template code directly
        """
        template = Template(
            """<footer>Hello World</footer>""",
        )
        return template.render(Context({}))
```

Notes:

1. We create `PartialTemplatesPreview` which inherits from `LookbookPreview`, the class can be seen as a `group` which can contains multiple previews.
2. We define two methods `header` and `footer` which will be used to render the preview

```bash
├── previews
│   └── template_preview.py
```

Create *django_lookbook/preview.html* in the project `templates` directory

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
</head>
<body>

<div>
  {{ preview_html }}
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
        crossorigin="anonymous"></script>
</body>
</html>
```

1. We import Bootstrap CSS and JS to the page.
2. `preview_html` is the HTML generated by the preview method.

```{note}
If you have other frontend assets such as Alpine.js, jQuery or CSS file, you should remember to include them in this template file `django_lookbook/preview.html`.
```

```bash
# create db tables and launch Django server
(venv)$ python manage.py migrate
(venv)$ python manage.py runserver
```

Now please check on [http://127.0.0.1:8000/lookbook](http://127.0.0.1:8000/lookbook):

1. The preview has been automatically detected and can be seen in the left sidebar
2. You can see the UI of the preview on the right side and final HTML source code can also be seen
3. The docstring of the preview has been extracted and display in the `Notes` tab, `Markdown` syntax is supported

Each time we visit a preview, the preview method would be called and the HTML would be displayed in the top iframe.

![](./images/bootstrap-preview.jpg)
