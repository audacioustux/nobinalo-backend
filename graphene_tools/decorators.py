from . import exceptions
from django.db.models import Q
from django.contrib.auth import get_user_model
from functools import wraps

__all__ = [
    'user_passes_test',
    'login_required',
    'staff_member_required',
    'permission_required',
]

User = get_user_model()


def context(f):
    def decorator(func):
        def wrapper(*args, **kwargs):
            info = args[f.__code__.co_varnames.index('info')]
            return func(info.context, *args, **kwargs)
        return wrapper
    return decorator


def user_passes_test(test_func):

    def decorator(f):
        @wraps(f)
        @context(f)
        def wrapper(context, *args, **kwargs):
            if test_func(context.user):
                return f(*args, **kwargs)
            raise exceptions.PermissionDenied()
        return wrapper
    return decorator


login_required = user_passes_test(lambda u: u.is_authenticated)
anonymous_required = user_passes_test(lambda u: u.is_anonymous)
staff_member_required = user_passes_test(lambda u: u.is_active and u.is_staff)
verified_required = user_passes_test(lambda u: u.is_verified())


def permission_required(perm):
    def check_perms(user):
        if isinstance(perm, str):
            perms = (perm,)
        else:
            perms = perm

        if user.has_perms(perms):
            return True
        return False
    return user_passes_test(check_perms)
