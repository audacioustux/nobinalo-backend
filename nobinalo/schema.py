import graphene
from django.conf import settings
from graphene_django.debug import DjangoDebug
import user.schema


class Query(user.schema.Query, graphene.ObjectType):
    if settings.DEBUG:
        debug = graphene.Field(DjangoDebug, name='__debug')


class Mutation(user.schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(
    query=Query,
    # mutation=Mutation
)
