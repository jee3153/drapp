const express = require('express');
const cors = require('cors');
const { ApolloServer, gql, UserInputError } = require('apollo-server-express');
const { GraphQLUpload, graphqlUploadExpress } = require('graphql-upload');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { TimestampResolver } = require('graphql-scalars');
const { finished } = require('stream/promises');

// const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { checkFileSize, generateUniqueFilename, uploadToGoogleCloud } = require('../libs/files');
const prisma = new PrismaClient();
require('dotenv').config();

/*
    WORK FLOW:
    npx prisma migrate: Whenever change in your schema
    npx prisma generate
    npx prisma studio: to view db table

*/

/*
    Every GraphQL resolver function receives 4 input arguments

    parent: GraphQL queries can be nested, Each level of nesting(curly braces nesting)
    corresponds to one resolver execution level
    1 level: feed resolver - return the entire data stored in posts
    2 level: resolvers of Post type
    Therefore incoming "parent" argument is the element inside the posts list.

    args: carries the arguments for the operation, in this case the "url" and "content"
    in Post to be created
*/

/**
 * FETCH EXAMPLES:
 * 
 * mutation {
 *  post(content:"useful", url:"https://urlurl.com") {
 *      content
 *      url
 *  }
 * }
 * 
 * query {
  feed(id:4) {
    id
    content
    url
  }
}

 */

const resolvers = {
	Upload: GraphQLUpload,
	Timestamp: TimestampResolver,

	Query: {
		info: () => 'information',
		allFeed: async (parent, args, context) => {
			// using PrismaClient instance to access to db
			return await context.prisma.post.findMany();
		},
		feed: async (parent, args, context) => {
			return await context.prisma.post.findUnique({
				where: {
					id: parseInt(args.id)
				}
			});
		}
	},
	Mutation: {
		uploadPost: async (parent, args, context) => {
			const { filename, mimetype, createReadStream } = await args.file;
			console.log(filename);
			console.log(args.content);

			try {
				const oneGb = 1000000000;
				await checkFileSize(createReadStream, oneGb);
			} catch (error) {
				if (typeof error === 'number') {
					throw new UserInputError('Maximum file size is 1GB');
				}
			}

			// generate a scrubbed unique filename
			const uniqueFilename = generateUniqueFilename(filename);
			console.log(uniqueFilename);
			// upload to Google Cloud Storage
			try {
				await uploadToGoogleCloud(createReadStream, uniqueFilename);
			} catch (error) {
				console.log(error);
				throw new UserInputError('Error with uploading to Google Cloud');
			}

			try {
				const newPost = await context.prisma.post.create({
					data: {
						content: args.content,
						url: `https://storage.googleapis.com/${process.env.GCP_BUCKET_ID}/${uniqueFilename}`
					}
				});
				console.log(newPost);

				return newPost;
			} catch (error) {
				console.log(`error to post ${error}`);
			}
		}
	}
};

// 3
async function startServer() {
	const server = new ApolloServer({
		typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
		resolvers,
		context: {
			prisma
		},
		uploads: false
	});
	await server.start();

	const app = express();

	app.use(graphqlUploadExpress());
	app.use(cors());
	server.applyMiddleware({ app });
	await new Promise((r) => app.listen({ port: 4000 }, r));
	console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startServer();

// server
//     .listen()
//     .then(({ url }) =>
//         console.log(`Server is running on ${url}`)
//     );
