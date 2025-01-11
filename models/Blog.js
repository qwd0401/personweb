const mongoose = require('mongoose');

// 定义博客文章模型的架构
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, '博客标题是必需的'],
        trim: true
    },
    content: {
        type: String,
        required: [true, '博客内容是必需的']
    },
    date: {
        type: Date,
        default: Date.now
    },
    tags: [{
        type: String,
        required: true
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema); 