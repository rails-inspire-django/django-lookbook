# Overview

django-lookbook is a Django library that provides a way to create reusable components for your Django project. It is inspired by [ViewComponent](https://viewcomponent.org/) for Ruby on Rails.

## What’s a django-lookbook

django-lookbook is an evolution of the Django partial template, a django-lookbook is actually a Python object.

```python
from django_lookbook import component

@component.register("hello")
class HelloComponent(component.Component):
    template = "<h1>Hello, {{ self.name }}!</h1>"

    def __init__(self, **kwargs):
        self.title = kwargs['title']
```

Notes:

1. Here we defined a Python class `HelloComponent` that inherits from `django_lookbook.component.Component`.
2. `@component.register("hello")` is a decorator that registers the component with the name `hello`.
3. The `template` attribute is a string that contains the HTML template for the component.
4. The `__init__` method is the constructor of the component, it receives the `name` parameter and stores it in the `self.name` attribute. So we can access it later in the template via `{{ self.name }}`.

To use the component in Django templates:

```django
{% load viewcomponent_tags %}

{% component "hello" name='Michael Yin' %}{% endcomponent %}
```

The `component` tag will initialize the component, and pass the `name` parameter to the `HelloComponent` constructor.

The returning HTML would be:

```html
<h1>Hello, Michael Yin!</h1>
```

## Why use django-lookbook

### Single responsibility

django-lookbook can help developers to build reusable components from the Django templates, and make the templates more readable and maintainable.

### Testing

django-lookbook components are Python objects, so they can be **easily tested** without touching Django view and Django urls.
