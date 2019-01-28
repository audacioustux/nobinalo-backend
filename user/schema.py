from django.contrib.auth import get_user_model
import graphene
from graphql import GraphQLError
from graphene_django import DjangoObjectType
from .models import EmailVerification, PhoneNoVerification
from graphene_tools.decorators import login_required

User = get_user_model()


class UserNode(DjangoObjectType):
    class Meta:
        model = User
        exclude_fields = ('password', )


class Query(graphene.ObjectType):
    whoami = graphene.Field(UserNode)

    def resolve_whoami(self, info):
        if info.context.user.is_authenticated:
            return info.context.user
        else:
            raise ValueError("User Not LoggedIn!")


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserNode)

    class Arguments:
        email = graphene.String()
        phone_no = graphene.String()
        password = graphene.String(required=True)

    @classmethod
    def mutate(self, info, **kwargs):
        user_object = User.objects.create_user(password=kwargs['password'])

        if kwargs['email']:
            EmailVerification.objects.add_email(
                email=kwargs['email'], user_object=user_object)
        elif kwargs['phone_no']:
            PhoneNoVerification.add_number(
                phone_no=kwargs['phone_no'], user_object=user_object)
        else:
            raise GraphQLError("Either email or phone number must be given")

        return CreateUser(User)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
