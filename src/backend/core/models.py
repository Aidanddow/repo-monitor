from datetime import datetime
from email import message
from django.db import models
import os
from django.contrib.auth.models import AbstractUser


# Create your models here.
class CustomUser(AbstractUser):
    pass
    # add additional fields in here

    def __str__(self):
        return self.username

class Developer(models.Model):
    username = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.username

class Repository(models.Model):
    repo_url = models.CharField(max_length=100, unique=True)
    repo_name = models.CharField(max_length=50)
    developers = models.ManyToManyField(Developer)
    archived = models.BooleanField(default=False)
    start_date = models.DateTimeField(blank=True, null=True)
    last_authored_date = models.DateTimeField(blank=True, null=True)
    # has_access = models.ManyToManyField(CustomUser)

    def __str__(self):
        return self.repo_name

    def get_file_path(self):
        return os.path.join("repos", self.repo_name)

class Branch(models.Model):
    branch_name = models.CharField(max_length=50)
    repo = models.ForeignKey(Repository, on_delete=models.CASCADE)
    # last_authored_date = models.DateTimeField(blank=True, null=True)
    last_fetch_date = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.branch_name



class Commit(models.Model):
    commit_hash = models.CharField(max_length=100)
    repo = models.ForeignKey(Repository, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    date = models.DateTimeField()
    author = models.ForeignKey(Developer, on_delete=models.CASCADE)
    message = models.CharField(max_length=500, blank=True)
    total_files = models.IntegerField()
    total_lines = models.IntegerField()


    def __str__(self):
        return str(self.commit_hash)


