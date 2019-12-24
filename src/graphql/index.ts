import { ApolloServer } from 'apollo-server-express';
import { default as typeDefs } from './schema';

export default new ApolloServer({
    typeDefs,
    resolvers: {},
    context: {},
});
