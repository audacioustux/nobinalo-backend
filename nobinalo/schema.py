import graphene
from django.conf import settings
from graphene_django.debug import DjangoDebug


class Query(graphene.ObjectType):
    if settings.DEBUG:
        debug = graphene.Field(DjangoDebug, name='__debug')


class Mutation(graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query)
