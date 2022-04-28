import UserSchema from "./model.js";
import express from "express";

const usersRouter = express.Router();

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserSchema.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const findUser = await UserSchema(req.params.userId);
    if (findUser) {
      res.send(findUser);
    } else {
      res.send("User not found");
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UserSchema(req.body);
    const { _id, first_name, last_name } = await newUser.save();
    res.status(201).send({ _id, first_name, last_name });
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const updatedUser = await UserSchema.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );

    if (updatedUser) {
      res.send(updatedUser);
    }
  } catch (error) {
    next(createError(404, "user not found"));
  }
});

usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const deletedUser = await UserSchema.findByIdAndDelete(req.params.userId);
    if (deletedUser) {
      res.status(204).send(deletedUser);
    }
  } catch (error) {
    next(createError(404, "user not found"));
  }
});

export default usersRouter;
