import pytest
from django.urls import reverse
from django_viewcomponent import component
from django_viewcomponent.preview import ViewComponentPreview
from parsel import Selector


@pytest.fixture(autouse=True)
def register_component():
    from tests.previews.simple_preview import ExampleComponent

    component.registry.register("example", ExampleComponent)


class TestLookBook:
    def test_setup(self):
        """
        In tests/conftest.py

        VIEW_COMPONENTS={
            "preview_base": ["previews"],
        },
        """
        assert len(ViewComponentPreview.previews.keys())

    def test_previews_discovery(self, client):
        response = client.get(reverse("django_lookbook:index"))

        assert response.status_code == 200

        assert b"Component Library" in response.content
        assert b"with_title" in response.content
        assert b"with_template_render" in response.content

    def test_inspect(self, client):
        slug = "/".join(["simple_example_component", "with_title"])
        response = client.get(
            reverse(
                "django_lookbook:inspect",
                kwargs={
                    "slug": slug,
                },
            )
        )

        assert response.status_code == 200
        assert b"def with_title" in response.content

        selector = Selector(text=response.content.decode("utf-8"))
        # use xpath to extract url attribute of id="preview-iframe"
        iframe_url = selector.xpath('//iframe[@id="preview-iframe"]/@src').get()
        response = client.get(iframe_url)

        assert response.status_code == 200
        # use django_viewcomponent/preview.html to render
        assert b"view-component-source-example" in response.content
