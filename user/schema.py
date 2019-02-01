from django.contrib.auth import get_user_model
import graphene
from graphql import GraphQLError
from graphene_django import DjangoObjectType
from .models import EmailVerification, PhoneNoVerification, EmailAddress, PhoneNumber
from graphene_tools.decorators import login_required, verified_required
# from django.db import transaction

User = get_user_model()


class UserNode(DjangoObjectType):
    class Meta:
        model = User
        exclude_fields = ('password', )


class UnverifiedEmailNode(DjangoObjectType):
    class Meta:
        model = EmailVerification
        exclude_fields = ('key', )


class EmailNode(DjangoObjectType):
    class Meta:
        model = EmailAddress


class UnverifiedPhoneNoNode(DjangoObjectType):
    class Meta:
        model = PhoneNoVerification
        exclude_fields = ('key', )


class Query(graphene.ObjectType):
    whoami = graphene.Field(UserNode)
    verified = graphene.Boolean()

    @login_required
    def resolve_whoami(self, info):
        return info.context.user

    @login_required
    def resolve_verified(self, info):
        return info.context.user.is_verified()


class CreateUser(graphene.Mutation):
    class Arguments:
        email = graphene.String()
        phone_no = graphene.String()
        password = graphene.String(required=True)
        full_name = graphene.String(required=True)

    user = graphene.Field(UserNode)
    u_email = graphene.Field(UnverifiedEmailNode)
    u_phone_no = graphene.Field(UnverifiedPhoneNoNode)
    # u_ -> unverified

    @staticmethod
    def mutate(root, info, email=None, phone_no=None, **kwargs):
        if not email and not phone_no:
            raise GraphQLError("Either email or phone number must be given!")

        u_email_object = u_phone_no_object = None

        if email:
            u_email_object = EmailVerification.objects.add_email(email=email)[0]
        if phone_no:
            u_phone_no_object = PhoneNoVerification.objects.add_number(phone_no=phone_no)[0]

        user_object = User.objects.create_user(password=kwargs['password'], full_name=kwargs['full_name'])

        return CreateUser(user=user_object, u_email=u_email_object, u_phone_no=u_phone_no_object)


class VerifyEmail(graphene.Mutation):
    class Arguments:
        key = graphene.Int(required=True)
        email = graphene.String(required=True)

    email = graphene.Field(EmailNode)

    @staticmethod
    @login_required
    def mutate(root, info, key, email):
        email_instance = EmailVerification.objects.verify_email(
            key, info.context.user, email, not info.context.user.is_verified()
        )
        return VerifyEmail(email=email_instance)


# class AddEmail(graphene.Mutation):
#     pass


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    verify_user = VerifyEmail.Field()
    # add_email = AddEmail.Field()
