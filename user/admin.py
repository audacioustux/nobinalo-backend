from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import User


class UserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('email', 'full_name')


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('email', 'full_name', 'handle', 'is_staff')
    list_filter = ('is_superuser', 'is_staff', 'is_active', 'groups')
    search_fields = ('handle', 'full_name', 'email')
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'full_name', 'handle', 'password')}),
        ('Personal info', {'fields': ('gender',)}),
        ('Permissions', {'fields': ('is_active', 'is_superuser', 'is_staff',
                                    'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)})
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (
            None, {
                'classes': ('wide',),
                'fields': ('email', 'full_name', 'password1', 'password2')
            }
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()
