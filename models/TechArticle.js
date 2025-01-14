const mongoose = require("mongoose");
const { dbLogger } = require("../config/logger");

const techArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "标题是必需的"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "描述是必需的"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "内容是必需的"],
    },
    category: {
      type: String,
      required: [true, "分类是必需的"],
      trim: true,
    },
    difficulty: {
      type: String,
      required: [true, "难度级别是必需的"],
      enum: ["入门", "进阶", "高级"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    resources: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    middleware: {
      pre: {
        save: function (next) {
          dbLogger("save", "TechArticle", this);
          next();
        },
        remove: function (next) {
          dbLogger("remove", "TechArticle", this);
          next();
        },
        updateOne: function () {
          dbLogger("update", "TechArticle", this.getQuery());
        },
      },
    },
  }
);

module.exports = mongoose.model("TechArticle", techArticleSchema);
