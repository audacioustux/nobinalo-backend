from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin, BaseUserManager
)
from django.core.mail import send_mail
from django.utils.timezone import now, timedelta
from .validators import RegexHandleValidator, BadwordValidator
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
import string
import hashlib
from django.db.models import ProtectedError, signals
from django.contrib.auth.models import BaseUserManager
from django.contrib.postgres.fields import JSONField


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(
            self,
            full_name,
            handle,
            password,
            email=None,
            phone_no=None,
            **kwargs
    ):
        if email:
            email = self.normalize_email(email)
        user_instance = self.model(
            handle=handle, full_name=full_name, **kwargs
        )
        user_instance.set_password(password)
        # email_instance = EmailAddress(email=email, )
        user_instance.save(using=self._db)
        return user_instance

    def create_user(
            self, full_name, handle=None, email=None, phone_no=None, password=None, **kwargs
    ):
        if not email and not phone_no:
            raise ValueError('Email or Phone No. must be given!')

        if handle:
            handle = self.model.normalize_username(handle)
        else:
            handle = hashlib.shake_256(bytes(email, "ascii")).hexdigest(32)

        kwargs.setdefault('is_staff', False)
        kwargs.setdefault('is_superuser', False)
        return self._create_user(
            full_name, handle, email, phone_no, password, **kwargs
        )

    def create_superuser(self, handle, full_name, password, **kwargs):
        kwargs.setdefault('is_staff', True)
        kwargs.setdefault('is_superuser', True)

        if kwargs.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if kwargs.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(
            full_name, handle, password, **kwargs
        )


class User(AbstractBaseUser, PermissionsMixin):
    handle = models.CharField(
        max_length=64,
        unique=True,
        validators=[RegexHandleValidator, BadwordValidator]
    )
    full_name = models.CharField(max_length=128)
    GENDER_CHOICES = (
        ('m', 'Male'),
        ('f', 'Female'),
        ('t', 'Trans*')
    )
    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        blank=True,
        null=True
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(
        default=False
    )

    # _all_contact_media = models.Q(app_label='user', model='emailaddress') | models.Q(app_label='app', model='phonenumber')
    # _contact_via = models.ForeignKey(ContentType, on_delete=models.PROTECT, limit_choices_to=_all_contact_media)
    # _contact_id = models.PositiveIntegerField()
    # primary_contact = GenericForeignKey('_contact_via', '_contact_id')

    USERNAME_FIELD = 'handle'
    REQUIRED_FIELDS = ['full_name', ]

    def __str__(self):
        return self.handle

    def get_full_name(self):
        return self.full_name

    objects = UserManager()

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"


class EmailAddress(models.Model):
    email = models.EmailField(unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_primary = models.BooleanField(default=False)
    for_digest = models.BooleanField(default=False)
    for_recovery = models.BooleanField(default=True)
    is_public = models.BooleanField(default=False)

    def send(self, subject, message, from_email=None, **kwargs):
        send_mail(subject, message, from_email, [self.email], **kwargs)


class SignUpEmailAddress(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(unique=True)


class EmailVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    email = models.EmailField()
    key = models.PositiveIntegerField()

    class Meta:
        unique_together = ('user', 'email')


class PhoneNumber(models.Model):
    number = models.CharField(max_length=20)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    for_auth = models.BooleanField()
    is_primary = models.BooleanField(default=False)
    for_digest = models.BooleanField(default=False)
    for_recovery = models.BooleanField(default=False)
    is_public = models.BooleanField(default=False)
    text_limit = models.IntegerField(default=-1)
    when_to_text = JSONField()


class SignUpPhoneNo(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_no = models.CharField(max_length=20)


class PhoneNoVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    phone_no = models.CharField(max_length=20)
    key = models.CharField(max_length=8)
    
# class EmailConfirmation(models.Model):
#     email = models.OneToOneField(EmailAddress, on_delete=models.CASCADE)
#     user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
#     created = models.DateTimeField(auto_now_add=True)
#     numeric_key = models.PositiveIntegerField()
#     is_numeric_key_exp = models.BooleanField()
#     long_key = models.CharField(max_length=48)

# class EmailAddress(models.Model):
#     email = models.EmailField(unique=True)
#     user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
#     # Key
#     long_key = models.CharField(max_length=48)
#     short_key = models.CharField(max_length=6)
#     # Timestamps
#     created = models.DateTimeField(auto_now_add=True)
#     verified_at = models.DateTimeField(null=True, blank=True)

# class EmailAddress(models.Model):
#     user = models.ForeignKey(User,
#                              verbose_name=_('user'),
#                              on_delete=models.CASCADE)
#     email = models.EmailField(unique=True,
#                               verbose_name=_('e-mail address'))
#     verified = models.BooleanField(verbose_name=_('verified'), default=False)

# class PhoneNumber(models.Model):
#     number = models.CharField(max_length=20, unique=True)
#     user = models.OneToOneField(User, on_delete=models.CASCADE,
#                                 null=True, blank=True)
#     # TODO: with NumberField()
#     short_key = models.CharField(max_length=6)
#     # Timestamps
#     code_sent_at = models.DateTimeField(null=True, blank=True)
#     verified_at = models.DateTimeField(null=True, blank=True)
