// 全局错误处理中间件
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // 区分不同类型的错误
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: '数据验证失败',
            errors: Object.values(err.errors).map(error => error.message)
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: '无效的ID格式'
        });
    }

    // 默认服务器错误响应
    res.status(500).json({
        success: false,
        message: '服务器内部错误'
    });
};

module.exports = errorHandler; 