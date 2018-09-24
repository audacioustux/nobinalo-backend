from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin, BaseUserManager
)
from django.core.mail import send_mail
from django.contrib.postgres.fields import JSONField
from django.core.cache import cache
from .validators import RegexHandleValidator, BadwordValidator
import hashlib


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(
            self,
            full_name,
            email,
            password=None,
            handle=None,
            **kwargs
    ):
        email = self.normalize_email(email)
        if handle:
            handle = self.model.normalize_username(handle)
        else:
            handle = hashlib.shake_256(bytes(email, "ascii")).hexdigest(32)

        user = self.model(
            handle=handle, email=email, full_name=full_name, **kwargs
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(
            self, full_name, email, **kwargs
    ):
        kwargs.setdefault('is_staff', False)
        kwargs.setdefault('is_superuser', False)
        return self._create_user(
            full_name, email, **kwargs
        )

    def create_superuser(self, full_name, email, password, handle, **kwargs):
        kwargs.setdefault('is_staff', True)
        kwargs.setdefault('is_superuser', True)

        if kwargs.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if kwargs.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(
            full_name, email, password, handle, **kwargs
        )


class EmailManager(models.Manager):
    def create_token(self, email, secret=None):
        


class Email(models.Model):
    email = models.EmailField(unique=True)
    # key
    jwt_secret = models.CharField(max_length=255)
    jwt_payload = JSONField()
    small_key = models.CharField(max_length=6)
    # TODO: add ip field, timestamp
    objects = EmailManager()


class Phone(models.Model):
    number = models.CharField(max_length=20, unique=True)
    # TODO: with NumberField()
    small_key = models.CharField(max_length=6)
    # TODO: add timestamp


class User(AbstractBaseUser, PermissionsMixin):
    handle = models.CharField(
        max_length=64,
        unique=True,
        validators=[RegexHandleValidator, BadwordValidator]
    )
    email = models.EmailField()
    is_email_verified = models.BooleanField()
    other_emails = models.ForeignKey(Email)

    phone_no = models.CharField(max_length=20)
    is_phone_no_verified = models.BooleanField()
    other_phone_no = models.ForeignKey(Phone)

    full_name = models.CharField(max_length=128)
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('T', 'Trans*')
    )
    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        blank=True,
        null=True
    )
    is_active = models.BooleanField(default=True)
    # TODO: change default to False later
    is_staff = models.BooleanField(
        default=False
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'handle']

    def __str__(self):
        return self.email

    def get_full_name(self):
        return self.full_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        send_mail(subject, message, from_email, [self.email], **kwargs)

    objects = UserManager()

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"
        unique_together = (
            ('email', 'is_email_verified'),
            ('phone_no', 'is_phone_no_verified')
        )
