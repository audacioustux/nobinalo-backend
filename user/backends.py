from django.contrib.auth.backends import ModelBackend
from .models import EmailAddress, SignUpEmailAddress, PhoneNumber, SignUpPhoneNumber
from django.core.exceptions import PermissionDenied


class HandleBackend(ModelBackend):
    def authenticate(self, request, username=None, handle=None, password=None):
        if not handle:
            if username:
                handle = username
            else:
                return None
        return super(HandleBackend, self).authenticate(request, username=handle, password=password)


class PhoneNumberBackend(ModelBackend):
    def authenticate(self, request, username=None, phone_no=None, password=None):
        # For compatibility with unchanged forms
        if not phone_no:
            if username:
                phone_no = username
            else:
                return None
        try:
            _phone_no = PhoneNumber.objects.get(phone_no=phone_no)
        except PhoneNumber.DoesNotExist:
            try:
                _signup_phone_no = SignUpPhoneNumber.objects.get(phone_no=phone_no)
            except SignUpPhoneNumber.DoesNotExist:
                return None
            else:
                _user = _signup_phone_no.user
                if PhoneNumber.objects.filter(user=_user).count() != 0:
                    if _user.check_password(password):
                        raise PermissionDenied
                    else:
                        return None
                else:
                    if _user.check_password(password) and self.user_can_authenticate(_user):
                        return _signup_phone_no.user
                    else:
                        return None
        else:
            user = _phone_no.user
            if user.check_password(password) and self.user_can_authenticate(user):
                return user


class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, email=None, password=None):
        # For compatibility with unchanged forms
        if not email:
            if username:
                email = username
            else:
                return None
        try:
            _email = EmailAddress.objects.get(email=email)
        except EmailAddress.DoesNotExist:
            try:
                _signup_email = SignUpEmailAddress.objects.get(email=email)
            except SignUpEmailAddress.DoesNotExist:
                return None
            else:
                _user = _signup_email.user
                if EmailAddress.objects.filter(user=_user).count() != 0:
                    if _user.check_password(password):
                        raise PermissionDenied
                    else:
                        return None
                else:
                    if _user.check_password(password) and self.user_can_authenticate(_user):
                        return _signup_email.user
                    else:
                        return None
        else:
            user = _email.user
            if user.check_password(password) and self.user_can_authenticate(user):
                return user


# TODO: Get rid of duplicate code
