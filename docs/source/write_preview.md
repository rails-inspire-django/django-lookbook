# Write Preview

## Preview Structure

```bash  
├── previews  
│   ├── hello_preview.py             # single preview file can work
│   ├── components                   # putting multiple previews in a directory can also work
│   │   ├── alert_preview.py  
│   │   ├── modal_preview.py  
```

1. Each preview file can contain multiple preview classes.
2. Each preview class should inherit from `ViewComponentPreview` and have at least one public method to render the preview.

## Use Cases

Writing preview is very simple, **just generate HTML according to the parameters** (we can get parameters from the `kwargs` of the preview method)

We can use preview to help us to develop and organize:

1. Useful HTML snippets
2. HTML component code, like `alert`, `modal`, `card`, etc. (You can take a look at [django-viewcomponent](https://django-viewcomponent.readthedocs.io/en/latest/overview.html))
3. Some landing pages
4. Responsive HTML email (So we do not need to send email to check the result each time)

## Isolated Environment

The preview give developer an isolated environment, so please feel free to play with it without worrying about breaking the production code, and you do not need to touch `urls.py`, `views.py` anymore.

## Fake Data

1. We can use [factory_boy](https://factoryboy.readthedocs.io/) or [model_bakery](https://model-bakery.readthedocs.io/) to generate fake data
2. We can use `unittest.mock` to generate fake data
3. We can also use `from django.test import RequestFactory`  to help simulate a request with special attributes.

All this can be done in Python code, without creating extra fixture files.
