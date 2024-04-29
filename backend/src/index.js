import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";
import { todos } from "./todos.js";
import { users } from "./users.js";

async function startServer() {
	const app = express();
	const server = new ApolloServer({
		typeDefs: `
      type User {
        id: ID!
        name: String!
        username: String!
        email: String!
        phone: String!
        website: String!
      }

      type Todo {
        id: ID!
        user: User
        title: String!
        completed: Boolean
      }

      type Query {
        getTodos: [Todo]
        getUsers: [User]
        getSingleUser(id: ID!): User
      }
    `,
		resolvers: {
			Todo: {
				// user: (todo) => users.find(user => user.id === todo.userId)
				user: async (todo) =>
					(
						await axios.get(
							`https://jsonplaceholder.typicode.com/users/${todo.userId}`
						)
					).data
			},
			Query: {
        // getTodos: () => todos,
        // getUsers: () => users,
				// getSingleUser: (parent, {id}) => users.find((e) => e.id == id)
				getTodos: async () =>
					(await axios.get(`https://jsonplaceholder.typicode.com/todos`)).data,
				getUsers: async () =>
					(await axios.get(`https://jsonplaceholder.typicode.com/users`)).data,
				getSingleUser: async (parent, { id }) =>
					(await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
			},
		},
	});

	app.use(bodyParser.json());
	app.use(cors());

	await server.start();

	app.use("/graphql", expressMiddleware(server));

	app.listen(8000, () => console.log("Server listening at port 8000"));
}

startServer();
