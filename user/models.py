from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin, UserManager
)
from django.core.mail import send_mail
from django.utils.timezone import now, timedelta
from .validators import RegexHandleValidator, BadwordValidator
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
import string
import hashlib
from django.db.models import ProtectedError, signals
from django.contrib.postgres.fields import JSONField
from django.utils.crypto import get_random_string
from django.utils.timezone import now
from django.core.exceptions import ValidationError


class User(AbstractBaseUser, PermissionsMixin):
    handle = models.CharField(
        max_length=64,
        unique=True,
        validators=[BadwordValidator, RegexHandleValidator]
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
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_primary = models.BooleanField(null=True)
    for_digest = models.BooleanField(default=False)
    for_recovery = models.BooleanField(default=True)
    is_public = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'is_primary')


class SignUpEmailAddress(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(unique=True)


class SignUpEmailVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    email = models.EmailField()
    key = models.PositiveIntegerField()

    class Meta:
        unique_together = ('user', 'email')


class PhoneNumber(models.Model):
    number = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_primary = models.BooleanField(null=True)
    for_two_step_auth = models.BooleanField(default=False)
    for_digest = models.BooleanField(default=False)
    for_recovery = models.BooleanField(default=False)
    is_public = models.BooleanField(default=False)
    text_limit = models.IntegerField(null=True, blank=True)
    when_to_text = JSONField()

    class Meta:
        unique_together = ('user', 'is_primary')


class SignUpPhoneNumber(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_no = models.CharField(max_length=20, unique=True)


class PhoneNoVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    phone_no = models.CharField(max_length=20)
    key = models.CharField(max_length=8)

    class Meta:
        unique_together = ('user', 'phone_no')
