from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

class Topic(models.Model):
    pass

class Tags(models.Model):
    pass


class Problem(models.Model):
    title = models.CharField(max_length = 96)
    description = models.TextField(max_length=100000)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, on_delete=models.SET_NULL)
    tags = models.ManyToManyField(Tags)
    DIFFICULTY_CHOICES = (
        ('e', 'Easy'),
        ('m', 'Medium'),
        ('h', 'Hard')
    )
    difficulty = models.CharField(max_length=1, choices=DIFFICULTY_CHOICES, blank=True)
    # NOTE: set by the author

class Options(models.Model):
    