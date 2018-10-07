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


class CreateUser(graphene.relay.ClientIDMutation):
    ok = graphene.Boolean()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        return CreateUser(ok=True)


class Mutation(graphene.ObjectType):
    create_email = CreateEmailAddress.Field()
    create_user = CreateUser.Field()


class Query(graphene.ObjectType):
    me = graphene.Field(UserNode)

    @login_required
    def resolve_me(self, info):
        return info.context.user