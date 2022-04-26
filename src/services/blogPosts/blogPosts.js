import express from "express";
import createError from "http-errors";
import BlogPostsModel from "./model.js";

const blogPostsRouter = express.Router();

blogPostsRouter.post("/", async (req, res, next) => {
  try {
    const newBlogPost = new BlogPostsModel(req.body); // here it happens the validation of req.body, if it is not ok Mongoose will throw an error (if it is ok it is NOT saved in db yet)

    const { _id } = await newBlogPost.save(); // --> {_id: 123io12j3oi21j, firstName: "aoidjoasijdo"}
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await BlogPostsModel.find();
    res.send(blogPosts);
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get("/:blogPostId", async (req, res, next) => {
  try {
    const blogPosts = await BlogPostsModel.findById(req.params.blogPostId);

    if (blogPosts) {
      res.send(blogPosts);
    } else {
      next(
        createError(404, `blogPost with id ${req.params.blogPostId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.put("/:blogPostId", async (req, res, next) => {
  try {
    const updatedBlogPost = await BlogPostsModel.findByIdAndUpdate(
      req.params.blogPostId, // WHO
      req.body, // HOW
      { new: true, runValidators: true } // OPTIONS. By default findByIdAndUpdate returns the record pre-modification. If you want to get back the newly updated record you should use the option: new true
      // by default validation is off here, if you want to have it --> runValidators: true
    );

    // ********************************* ALTERNATIVE METHOD ***************************************

    // const blogPost = await BlogPostsModel.findById(req.params.blogPostId)

    // blogPost.firstName = "John"

    // await blogPost.save()

    if (updatedBlogPost) {
      res.send(updatedBlogPost);
    } else {
      next(
        createError(404, `blogPost with id ${req.params.blogPostId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.delete("/:blogPostId", async (req, res, next) => {
  try {
    const deletedBlogPost = await BlogPostsModel.findByIdAndDelete(
      req.params.blogPostId
    );
    if (deletedBlogPost) {
      res.status(204).send();
    } else {
      next(
        createError(404, `BlogPost with id ${req.params.blogPostId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default blogPostsRouter;