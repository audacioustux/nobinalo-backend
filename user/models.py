from nobinalo.fields import TrueBooleanField
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
            length=self.model._meta.get_field('handle').max_length - len(_prefix),
            allowed_chars=string.ascii_lowercase + string.digits
        )
        try:
            self.model.objects.get(handle=handle)
        except self.DoesNotExist:
            return handle
        else:
            return self._gen_rand_handle()

    def _create_user(self, handle, password, **extra_fields):
        if not handle:
            handle = self._gen_rand_handle()
        else:
            handle = self.model.normalize_username(handle)

        user = self.model(handle=handle, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, handle, password=None, **extra_fields):
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

    def get_full_name(self):
        return self.full_name

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"


class EmailAddress(models.Model):
    email = models.EmailField(unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name="emails")
    is_primary = TrueBooleanField()
    for_digest = models.BooleanField(default=False)
    for_recovery = models.BooleanField(default=True)
    is_public = models.BooleanField(default=False)

    def __str__(self):
        return self.email

    class Meta:
        unique_together = ('user', 'is_primary')


class SignUpEmailAddress(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.email


class EmailVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    email = models.EmailField()
    key = models.PositiveIntegerField()

    def __str__(self):
        return self.email

    class Meta:
        unique_together = ('user', 'email')


class PhoneNumber(models.Model):
    phone_no = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_primary = TrueBooleanField()
    for_two_step_auth = models.BooleanField(default=False)
    for_digest = models.BooleanField(default=False)
    for_recovery = models.BooleanField(default=False)
    is_public = models.BooleanField(default=False)
    text_limit = models.IntegerField(null=True, blank=True)
    when_to_text = JSONField()

    def __str__(self):
        return self.phone_no

    class Meta:
        unique_together = ('user', 'is_primary')


class SignUpPhoneNumber(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_no = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.phone_no


class PhoneNoVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    phone_no = models.CharField(max_length=20)
    key = models.CharField(max_length=8)

    def __str__(self):
        return self.phone_no

    class Meta:
        unique_together = ('user', 'phone_no')
