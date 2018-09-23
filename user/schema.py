from django.contrib.auth import get_user_model
import graphene
from graphene_django import DjangoObjectType

User = get_user_model()


class UserNode(DjangoObjectType):
    class Meta:
        model = User
        interfaces = (graphene.relay.Node,)


class CreateUser(graphene.relay.ClientIDMutation):
    user = graphene.Field(UserNode)

    class Input:
        email = graphene.String(required=True)
        full_name = graphene.String(required=True)
        password = graphene.String(required=True)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = User.objects.create_user(
            email=input.get('email'),
            full_name=input.get('full_name'),
            password=input.get('password')
        )
        return CreateUser(user=user)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()


class Query(graphene.ObjectType):
    me = graphene.Field(UserNode)

    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged!')
        return user
