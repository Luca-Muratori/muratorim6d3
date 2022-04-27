import express from "express";
import createError from "http-errors";
import BlogPostsModel from "./model.js";
import CommentModel from "../comments/model.js";
import q2m from "query-to-mongo";

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
    if (!req.query) {
      const blogPosts = await BlogPostsModel.find();
      res.send(blogPosts);
    } else {
      const mongoQuery = q2m(req.query);
      const total = await BlogPostsModel.countDocuments(mongoQuery.criteria);
      const blogPost = await BlogPostsModel.find(
        mongoQuery.criteria,
        mongoQuery.options.fields
      )
        .sort(mongoQuery.options.sort)
        .skip(mongoQuery.options.skip)
        .limit(mongoQuery.options.limit);
      res.send({
        links: mongoQuery.links("http://localhost:3001/blogPosts", total),
        totalPages: Math.ceil(total / mongoQuery.options.limit),
        total,
        blogPost,
      });
    }
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

//-----------------------------------------------Add the comment CRUD endpoints
blogPostsRouter.post("/:blogPostId/comment", async (req, res, next) => {
  try {
    const BlogPost = await BlogPostsModel.findById(req.params.blogPostId);
    if (BlogPost) {
      const commentToInsert = await CommentModel(req.body);

      const modifiedBlogPost = await BlogPostsModel.findByIdAndUpdate(
        req.params.blogPostId,
        { $push: { comments: commentToInsert } },
        { new: true, runValidators: true }
      );

      if (modifiedBlogPost) {
        res.send(modifiedBlogPost);
      } else {
        next(createError(404, "blogPost not found"));
      }
    } else {
      next(createError(404, "blogPost not found"));
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
});

blogPostsRouter.get("/:blogPostId/comment", async (req, res, next) => {
  try {
    const blogPost = await BlogPostsModel.findById(req.params.blogPostId);
    if (blogPost) {
      res.send(blogPost.comments);
    } else {
      next(
        createError(404, `Blog post with ${req.params.blogPostId} not found`)
      );
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
});

blogPostsRouter.get(
  "/:blogPostId/comment/:commentId",
  async (req, res, next) => {
    try {
      const blogPost = await BlogPostsModel.findById(req.params.blogPostId);

      if (blogPost) {
        const comment = blogPost.comments.find(
          (comment) => (req.params.commentId = comment._id.toString())
        );
        if (comment) {
          res.send(comment);
        } else {
          next(createError(404, "Comment not found"));
        }
      } else {
        next(createError(404, "Blog post not found"));
      }
    } catch (error) {
      next(error);
    }
  }
);

blogPostsRouter.put(
  "/:blogPostId/comment/:commentId",
  async (req, res, next) => {
    try {
      const blogPost = await BlogPostsModel.findById(req.params.blogPostId);
      if (blogPost) {
        const index = blogPost.comments.findIndex(
          (comment) => comment._id.toString() === req.params.commentId
        );
        if (index !== -1) {
          blogPost.comments[index] = {
            ...blogPost.comments[index],
            ...req.body,
          };
          await blogPost.save();
          res.send(blogPost);
        } else {
          next(createError(404, "comment not found"));
        }
      } else {
        next(createError(404, "Blog post not found"));
      }
    } catch (error) {
      next(error);
    }
  }
);

blogPostsRouter.delete(
  "/:blogPostId/comment/:commentId",
  async (req, res, next) => {
    try {
      const modifiedBlogPost = await BlogPostsModel.findByIdAndUpdate(
        req.params.blogPostId,
        {
          $pull: { comments: { _id: req.params.commentId } },
        },
        { new: true }
      );

      if (modifiedBlogPost) {
        res.send(modifiedBlogPost);
      } else {
        next(createError(404, "blogPost not found"));
      }
    } catch (error) {
      next(error);
    }
  }
);

export default blogPostsRouter;
