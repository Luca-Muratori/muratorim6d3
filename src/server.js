import express from "express";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import cors from "cors";

import blogPostsRouter from "./services/blogPosts/blogPosts.js";
import authorsRouter from "./services/authors/author.js";
import usersRouter from "./services/users/users.js";

const server = express();
const port = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());

server.use("/blogPosts", blogPostsRouter);

//authors of blog posts, one user to many blog posts
server.use("/authors", authorsRouter);

//users
server.use("/users", usersRouter);

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!");

  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});
