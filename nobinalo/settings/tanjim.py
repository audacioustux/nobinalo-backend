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
