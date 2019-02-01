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
from django.db.models import Q
from django.db import IntegrityError
from django.core.mail import send_mail
from graphene_tools.exceptions import KeyExpired
from django.dispatch import receiver
from django.db.models.signals import pre_save
import asyncio


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
        except self.model.DoesNotExist:
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
        max_length=40,
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

    def is_verified(self, get_with=False):
        try:
            verified_with = User.objects.get(
                Q(pk=self.pk) & (
                    Q(email__is_primary=True) |
                    Q(phone_no__is_primary=True)
                )
            )
            if get_with:
                return verified_with
            return True
        except User.DoesNotExist:
            if get_with:
                return None
            return False

    def get_full_name(self):
        return self.full_name

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"


class EmailAddress(models.Model):
    email = models.EmailField(unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name="emails", related_query_name="email")
    is_primary = models.NullBooleanField(default=None)
    # 'is_primary' should never be == False
    for_digest = models.BooleanField(default=False)
    for_recovery = models.BooleanField(default=True)
    is_public = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.is_primary is False:
            self.is_primary = None
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email

    class Meta:
        unique_together = ('user', 'is_primary')


class EmailVerificationManager(models.Manager):
    def add_email(self, email):
        try:
            EmailAddress.objects.get(email=email)
            raise Exception('Email Already Exist!')
            # TODO: make or use exception class/type
        except EmailAddress.DoesNotExist:
            _key = get_random_string(length=5, allowed_chars=string.digits)
            email_instance, is_created = self.get_or_create(email=email, defaults={'key': _key})
            email_instance.send_mail(message=_key)
        return email_instance, is_created

    @staticmethod
    def _add_as_verified(email, user_object, is_primary):
        email, is_created = EmailAddress.objects.get_or_create(
            email=email,
            user=user_object,
            defaults={'is_primary': is_primary}
        )
        if not is_created and email.user != user_object:
            raise KeyExpired
        return email

    def verify_email(self, key, user_object, email, is_primary=None):
        try:
            _email = self.model.objects.get(email=email, key=key)
            return self._add_as_verified(email, user_object, is_primary)
        except self.model.DoesNotExist:
            raise ValidationError("Verification failed!")


class EmailVerification(models.Model):
    email = models.EmailField(unique=True)
    key = models.PositiveIntegerField()

    objects = EmailVerificationManager()

    def __str__(self):
        return self.email

    def send_mail(self, *args, **kwargs):
        send_mail(
            subject="Verify Email",
            from_email="tangimhossain1@gmail.com",
            recipient_list=(self.email,),
            *args, **kwargs
        )


class PhoneNumber(models.Model):
    phone_no = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="numbers", related_query_name="phone_no")
    is_primary = models.NullBooleanField(default=None)
    # 'is_primary' should never be 'False'
    for_two_step_auth = models.BooleanField(default=False)
    for_digest = models.BooleanField(default=False)
    for_recovery = models.BooleanField(default=False)
    is_public = models.BooleanField(default=False)
    text_limit = models.IntegerField(null=True, blank=True)
    when_to_text = JSONField()

    def save(self, *args, **kwargs):
        if self.is_primary is False:
            self.is_primary = None
        super().save(*args, **kwargs)

    def __str__(self):
        return self.phone_no

    class Meta:
        unique_together = ('user', 'is_primary')


class PhoneNoVerificationManager(models.Manager):
    def add_number(self, phone_no, user_object):
        number = self.Model(user=user_object, phone_no=phone_no)
        number.key = get_random_string(
            length=6,
            allowed_chars=string.digits + string.ascii_letters
        )
        number.save()

    @staticmethod
    def _add_as_verified(phone_no, user_object):
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
                raise ValidationError("Verification failed!")


class PhoneNoVerification(models.Model):
    phone_no = models.CharField(max_length=20, unique=True)
    key = models.CharField(max_length=8)

    def __str__(self):
        return self.phone_no
