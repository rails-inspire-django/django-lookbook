def register_form_class(form_class):
    def decorator(func):
        func.form_class = form_class
        return func

    return decorator
