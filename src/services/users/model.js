import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
  },
  {
    timestamp: true,
  }
);

export default model("User", UserSchema);
