from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin
)
from django.core.mail import send_mail
from django.utils.timezone import now, timedelta
from .validators import RegexHandleValidator, profanity_validator
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
import string
import hashlib
from django.db.models import ProtectedError, signals
from django.contrib.postgres.fields import JSONField
from django.utils.crypto import get_random_string
from django.utils.timezone import now
from django.core.exceptions import ValidationError
from django.contrib.auth.base_user import BaseUserManager
from django.utils.crypto import get_random_string


class UserManager(BaseUserManager):
    use_in_migration = True

    def _gen_rand_handle(self):
        _prefix = "_nb."
        handle = _prefix + get_random_string(
            length=self.model._meta.get_field(
                'handle').max_length - len(_prefix),
            allowed_chars=string.ascii_lowercase + string.digits
        )
        try:
            self.model.objects.get(handle=handle)
        except self.DoesNotExist:
            return handle
        else:
            return self._gen_rand_handle()

    def _create_user(self, handle, password, **extra_fields):
        if handle:
            handle = self.model.normalize_username(handle)
        else:
            handle = self._gen_rand_handle()

        user = self.model(handle=handle, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, password, handle=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)

        return self._create_user(handle, password, **extra_fields)

    def create_superuser(self, handle, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(handle, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    handle = models.CharField(
        max_length=32,
        unique=True,
        validators=[profanity_validator, RegexHandleValidator]
    )
    full_name = models.CharField(max_length=128)
    display_name = models.CharField(max_length=64, blank=True)
    GENDER_CHOICES = (
        ('m', 'Male'),
        ('f', 'Female'),
        ('t', 'Trans*')
    )
    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        blank=True
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'handle'
    REQUIRED_FIELDS = ['full_name', ]

    def __str__(self):
        return self.handle

    def is_verified(self):
        if self.EmailAddress

    def get_full_name(self):
        return self.full_name

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"


class EmailAddressManager(models.Manager):
    def remove_email(self, email_object, allow_delete_primary=False):
        if not allow_delete_primary and email_object.is_primary:
            raise "PrimaryDeletion"
        else:
            return email_object.delete()


class EmailAddress(models.Model):
    email = models.EmailField(unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name="emails")
    is_primary = models.NullBooleanField(default=None)
    # 'is_primary' should never be 'False'
    for_digest = models.BooleanField(default=False)
    for_recovery = models.BooleanField(default=True)
    is_public = models.BooleanField(default=False)

    def __str__(self):
        return self.email

    class Meta:
        unique_together = ('user', 'is_primary')


class EmailVerificationManager(models.Manager):
    def add_email(self, email, user_object):
        email = self.Model(user=user_object, email=email)
        email.key = get_random_string(
            length=5,
            allowed_chars=string.digits
        )
        email.save()

    def _add_as_verified(self, email, user_object):
        email = EmailAddress.Model(
            email=email,
            user=user_object,
        )
        try:
            EmailAddress.objects.get(user=user_object, is_primary=True)
        except EmailAddress.DoesNotExist:
            email.is_primary = True

        email.save()
        return email

    def verify_email(self, key=None, user=None, email=None, token=None):
        if not key and not token:
            raise ValueError("Either key or token must be given!")
        if key:
            if not user or not email:
                raise ValueError("User object and email must be given!")
            try:
                _email = self.model.objects.get(
                    user=user, email=email, key=key)
                return self._add_as_verified(email, user)

            except self.DoesNotExist:
                raise ValidationError("Verification faild!")


class EmailVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    email = models.EmailField()
    key = models.PositiveIntegerField()

    def __str__(self):
        return self.email

    class Meta:
        unique_together = ('user', 'email')


class PhoneNoManager(models.Manager):
    def remove_number(self, number_object, allow_delete_primary=False):
        if not allow_delete_primary and number_object.is_primary:
            raise "PrimaryDeletion"
        else:
            return number_object.delete()


class PhoneNumber(models.Model):
    phone_no = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_primary = models.NullBooleanField(default=None)
    # 'is_primary' should never be 'False'
    for_two_step_auth = models.BooleanField(default=False)
    for_digest = models.BooleanField(default=False)
    for_recovery = models.BooleanField(default=False)
    is_public = models.BooleanField(default=False)
    text_limit = models.IntegerField(null=True, blank=True)
    when_to_text = JSONField()

    objects = PhoneNoManager()

    def __str__(self):
        return self.phone_no

    class Meta:
        unique_together = ('user', 'is_primary')


class PhoneNoVerificationManager(models.Manager):
    def add_number(self, phone_no, user_object):
        number = self.Model(user=user_object, phone_no=phone_no)
        number.key = get_random_string(
            length=5,
            allowed_chars=string.digits
        )
        number.save()

    def _add_as_verified(self, phone_no, user_object):
        number = PhoneNumber.Model(
            phone_no=phone_no,
            user=user_object,
        )
        try:
            PhoneNumber.objects.get(user=user_object, is_primary=True)
        except PhoneNumber.DoesNotExist:
            number.is_primary = True

        number.save()
        return number

    def verify_number(self, key=None, user=None, phone_no=None, token=None):
        if not key and not token:
            raise ValueError("Either key or token must be given!")
        if key:
            if not user or not phone_no:
                raise ValueError("User object and phone number must be given!")
            try:
                _email = self.model.objects.get(
                    user=user, phone_no=phone_no, key=key)
                return self._add_as_verified(phone_no, user)

            except self.DoesNotExist:
                raise ValidationError("Verification faild!")


class PhoneNoVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    phone_no = models.CharField(max_length=20)
    key = models.CharField(max_length=8)

    def __str__(self):
        return self.phone_no

    class Meta:
        unique_together = ('user', 'phone_no')
