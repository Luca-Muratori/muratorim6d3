import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogPostsSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
    },
    author: {
      name: { type: String, required: true },
      avatar: { type: String, required: true },
    },
    content: { type: String, required: true },
    comments: [
      {
        comment_title: String,
        comment_text: String,
        comment_user_name: String,
      },
    ],
  },
  { timestamps: true } // adds and manages automatically createdAt and updatedAt fields
);

export default model("BlogPost", blogPostsSchema);
