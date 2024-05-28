from django import forms


class ToggleSwitchWidget(forms.widgets.CheckboxInput):
    template_name = "lookbook/fields/toggle_switch_widget.html"
