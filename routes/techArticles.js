const express = require("express");
const router = express.Router();
const TechArticle = require("../models/TechArticle");
const auth = require("../middleware/auth");
const { logger } = require("../config/logger");

// 获取所有技术文章
router.get("/", async (req, res) => {
  try {
    const articles = await TechArticle.find().sort({ date: -1 });
    res.json({ success: true, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 获取单个技术文章
router.get("/:id", async (req, res) => {
  try {
    const article = await TechArticle.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: "文章不存在" });
    }
    res.json({ success: true, data: article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 创建技术文章（需要管理员权限）
router.post("/", auth, async (req, res) => {
  try {
    const article = new TechArticle(req.body);
    const savedArticle = await article.save();

    logger.info({
      type: "api",
      operation: "create_article",
      userId: req.admin.id,
      articleId: savedArticle._id,
    });

    res.status(201).json({
      success: true,
      data: savedArticle,
    });
  } catch (err) {
    logger.error({
      type: "api_error",
      operation: "create_article",
      error: err.message,
      stack: err.stack,
    });

    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

// 更新技术文章（需要管理员权限）
router.put("/:id", auth, async (req, res) => {
  try {
    const article = await TechArticle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!article) {
      return res.status(404).json({ success: false, message: "文章不存在" });
    }
    res.json({ success: true, data: article });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 删除技术文章（需要管理员权限）
router.delete("/:id", auth, async (req, res) => {
  try {
    const article = await TechArticle.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: "文章不存在" });
    }
    await article.deleteOne();
    res.json({ success: true, message: "文章已删除" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
