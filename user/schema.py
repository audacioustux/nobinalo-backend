from django.contrib.auth import get_user_model
import graphene
from graphene_django import DjangoObjectType
from .models import EmailAddress
from graphene_tools.decorators import login_required

User = get_user_model()


class UserNode(DjangoObjectType):
    class Meta:
        model = User
        interfaces = (graphene.relay.Node,)
        exclude_fields = ('password', )

#
# class CanLogin(graphene.ObjectType):
#     can_login = graphene


class Query(graphene.ObjectType):
    whoami = graphene.Field(UserNode)

    def resolve_whoami(self, info):
        if info.context.user.is_authenticated:
            return info.context.user
        else:
            raise ValueError("User Not LoggedIn!")
