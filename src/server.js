import express from "express";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import cors from "cors";

import blogPostsRouter from "./services/blogPosts/blogPosts.js";

const server = express();
const port = process.env.PORT || 3001;

// *************************************** MIDDLEWARES ***************************************

server.use(cors());
server.use(express.json());

// *************************************** ENDPOINTS *****************************************

server.use("/blogPosts", blogPostsRouter);

// ************************************** ERROR HANDLERS *************************************

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!");

  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});