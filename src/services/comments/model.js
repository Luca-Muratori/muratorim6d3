import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    comment_title: { type: String, required: true },
    comment_text: { type: String, required: true },
    user_name: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default model("Comment", commentSchema);
