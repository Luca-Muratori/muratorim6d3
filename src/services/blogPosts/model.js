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
    authors: [{ type: Schema.Types.ObjectId, ref: "Author" }],
    content: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true } // adds and manages automatically createdAt and updatedAt fields
);

//---------------------custom methods--------------------

blogPostsSchema.static("findBlogPostWithAuthor", async function (mongoQuery) {
  const total = await this.countDocuments(mongoQuery.criteria);

  const blogPosts = await this.find(
    mongoQuery.criteria,
    mongoQuery.options.fields
  )
    .skip(mongoQuery.options.skip)
    .limit(mongoQuery.options.limit)
    .sort(mongoQuery.options.sort)
    .populate({ path: "authors", select: "first_name last_name" });
  return { total, blogPosts };
});

export default model("BlogPost", blogPostsSchema);
