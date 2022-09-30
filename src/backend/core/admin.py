from django.contrib import admin
from core.models import Branch, Developer, Repository, Commit

# Register your models here.

admin.site.register(Repository)
admin.site.register(Branch)
admin.site.register(Developer)
admin.site.register(Commit)
