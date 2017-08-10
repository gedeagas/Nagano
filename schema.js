import { makeExecutableSchema } from 'graphql-tools';
import Db from './db';

const typeDefs = `
  type User {
    id: Int!
    firstName: String
    lastName: String
    email: String
    posts: [Post] # the list of Posts by this author
  }
  type Post {
    id: Int!
    title: String
    content: String
    user: User
  }
  # the schema allows the following query:
  type Query {
    posts: [Post]
    user(userID: Int!): User
  }
`;

const resolvers = {
  Query: {
    posts: () => Db.models.post.findAll(),
    user: (_, { userID }) => Db.models.user.findOne({
      where: {
        id: userID,
      },
    }),
    
  },
  User: {
    posts(user) {
      return Db.models.post.findAll({
        where: {
          userId: user.id,
        },
      });
    },
  },
};

export const Schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default Schema;
