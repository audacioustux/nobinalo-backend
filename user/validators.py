from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator
from nobinalo.common.data import badwords


def BadwordValidator(value):
    if value in badwords:
        raise ValidationError(
            _('\'%(value)s\' is not acceptable handle.'),
            params={'value': value},
        )


RegexHandleValidator = RegexValidator(
    regex=r'^(?=.{3,}$)(?![_.])(?!.*[_.]{2})(?=.*[a-z])[a-z0-9._]+(?<![_.])$',
    # (?=.{3,30}$) = username is 3-30 characters long. (max_length value used in model)
    # (?![_.]) = no _ or . at the beginning
    # (?!.*[_.]{2}) = no __ or _. or ._ or .. inside
    # (?=.*[a-z]) = at least one alphabet
    # [a-z0-9._] = allowed characters
    # (?<![_.]) = no _ or . at the end
    # TODO: structured error massage
)
