# Contributing

## Frontend

Unlike many Django developers who like to write client side code in template, I prefer to put them in a `*.js` files and Stimulus JS is my favorite to write **reusable** and **maintainable** JavaScript code.

```bash
$ npm install

# launch webpack to compile the frontend assets and put them in `src/django_lookbook/static`
$ npm run watch
```

## Backend

```bash
# install the package in editable mode
$ pip install -e .
```

Notes:

1. Then you can install it in your Django project and debug it.
2. Or you can run the tests with `pytest`.
