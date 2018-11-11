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


class Query(graphene.ObjectType):
    whoami = graphene.Field(UserNode)

    @login_required
    def resolve_whoami(self, info):
        print(info.context.session)
        info.context.set_cookie("sessionid", "y2m0jpbn9jfczcc9xgikgua5")
        return info.context.user
