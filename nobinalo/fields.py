from django import forms
from django.db.models.fields import NullBooleanField
from django.core.exceptions import ValidationError


class TrueBooleanField(NullBooleanField):
    description = "Boolean (Either True or, False as None)"

    def to_python(self, value):
        if value in self.empty_values or value in ('f', 'False', '0', False):
            return None
        if value in ('t', 'True', '1', True):
            return True
        raise ValidationError(
            "'%(value)s' value must be either None, True or False",
            code='invalid',
            params={'value': value},
        )

    def formfield(self, **kwargs):
        if self.choices:
            include_blank = not (self.has_default() or 'initial' in kwargs)
            defaults = {'choices': self.get_choices(include_blank=include_blank)}
        else:
            form_class = forms.BooleanField
            # In HTML checkboxes, 'required' means "must be checked" which is
            # different from the choices case ("must select some value").
            # required=False allows unchecked checkboxes.
            defaults = {'form_class': form_class, 'required': False}
        return super().formfield(**{**defaults, **kwargs})

    def get_internal_type(self):
        return "TrueBooleanField"

