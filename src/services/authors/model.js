import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AuthorSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
  },
  {
    timestamp: true,
  }
);

export default model("Author", AuthorSchema);
