import {gql} from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: (): string => 'Hello world!',
  },
};

export {
  typeDefs,
  resolvers,
};
