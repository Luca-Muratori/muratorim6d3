import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    comment_title: { type: String, required: true },
    comment_text: { type: String, required: true },
    comment_user_name: { type: String, required: true },
  },
  { timestamps: true }
);

export default model("Comment", commentSchema);
