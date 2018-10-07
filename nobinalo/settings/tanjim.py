from .dev import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'nobinalo',
        'USER': 'tux',
        'PASSWORD': '12345678',
        'HOST': 'localhost',
        'PORT': '',
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'tangimhossain1@gmail.com'
EMAIL_HOST_PASSWORD = get_secret('SMTP_KEY')
EMAIL_PORT = 587
EMAIL_USE_TLS = True
