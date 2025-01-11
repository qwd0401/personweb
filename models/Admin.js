const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, '用户名是必需的'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, '密码是必需的'],
        minlength: 6,
        select: false  // 查询时默认不返回密码
    }
}, {
    timestamps: true
});

// 密码加密中间件
adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
});

// 验证密码的方法
adminSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema); 