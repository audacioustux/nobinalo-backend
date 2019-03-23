import { typeDefs, resolvers } from './user';

const { ApolloServer } = require('apollo-server-express');

export default new ApolloServer({ typeDefs, resolvers });
