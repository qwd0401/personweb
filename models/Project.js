const mongoose = require('mongoose');

// 定义项目模型的架构
const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, '项目标题是必需的'],
        trim: true,
        minlength: [2, '标题至少需要2个字符'],
        maxlength: [100, '标题不能超过100个字符']
    },
    description: {
        type: String,
        required: [true, '项目描述是必需的'],
        minlength: [10, '描述至少需要10个字符'],
        maxlength: [1000, '描述不能超过1000个字符']
    },
    technologies: {
        type: [String],  // 数组类型
        required: [true, '技术栈是必需的'],
        validate: {
            validator: function(v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: '技术栈不能为空'
        }
    },
    outcome: {
        type: String,
        required: [true, '项目成果是必需的'],
        minlength: [5, '项目成果描述至少需要5个字符'],
        maxlength: [500, '项目成果描述不能超过500个字符']
    }
}, {
    timestamps: true  // 自动添加 createdAt 和 updatedAt 字段
});

module.exports = mongoose.model('Project', projectSchema); 