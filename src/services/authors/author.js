import AuthorSchema from "./model.js";
import express from "express";

const authorsRouter = express.Router();

authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await AuthorSchema.find();
    res.send(authors);
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/:authorId", async (req, res, next) => {
  try {
    const findAuthor = await AuthorSchema(req.params.authorId);
    if (findAuthor) {
      res.send(findAuthor);
    } else {
      res.send("Author not found");
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorSchema(req.body);
    const { _id, first_name, last_name } = await newAuthor.save();
    res.status(201).send({ _id, first_name, last_name });
  } catch (error) {
    next(error);
  }
});

authorsRouter.put("/:authorId", async (req, res, next) => {
  try {
    const updatedAuthor = await AuthorSchema.findByIdAndUpdate(
      req.params.authorId,
      req.body,
      { new: true, runValidators: true }
    );

    if (updatedAuthor) {
      res.send(updatedAuthor);
    }
  } catch (error) {
    next(createError(404, "author not found"));
  }
});

authorsRouter.delete("/:authorId", async (req, res, next) => {
  try {
    const deletedAuthor = await AuthorSchema.findByIdAndDelete(
      req.params.authorId
    );
    if (deletedAuthor) {
      res.status(204).send(deletedAuthor);
    }
  } catch (error) {
    next(createError(404, "author not found"));
  }
});

export default authorsRouter;
