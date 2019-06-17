import {ApolloServer} from 'apollo-server-express';

import {resolvers, typeDefs} from './user';

export default new ApolloServer({typeDefs, resolvers});
