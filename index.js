const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyparser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
    type Todo{
        id:ID!
        title:String!
        completed:Boolean!
        userId:ID!
        user:User
    }
   type User {
    id:ID!
    name:String!
    email:String!
   }

    type Query{
        getTodo:[Todo]
        gettodobyid(id:ID!):Todo
        getUser:[User]
        getUserbyID(id:ID!):[User]
    }

    `,
    resolvers: {
      Todo: {
        user: async (parent, args) =>
          (
            await axios.get(
              `https://jsonplaceholder.typicode.com/users/${parent.id}`
            )
          ).data,
      },

      Query: {
        getTodo: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/todos/")).data,

        gettodobyid: async (parent, args) =>
          (
            await axios.get(
              `https://jsonplaceholder.typicode.com/todos/${args.id}`
            )
          ).data,

        getUser: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/users")).data,

        getUserbyID: async (parent, args) =>
          (
            await axios.get(
              `https://jsonplaceholder.typicode.com/users/${args.id}`
            )
          ).data,
      },
    },
  });

  app.use(bodyparser.json());
  app.use(cors());

  await server.start();
  app.use("/graphql", expressMiddleware(server));

  app.listen(8000, () => console.log("server started at port 8000"));
}

startServer();
