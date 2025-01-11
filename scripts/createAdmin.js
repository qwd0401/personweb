const mongoose = require('mongoose');
const Admin = require('../models/Admin');

mongoose.connect('mongodb://root:nvtqlxlq@personalweb-mongodb.ns-itw5blp2.svc:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function createAdmin() {
    try {
        // 先检查是否已存在管理员账号
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        
        if (existingAdmin) {
            // 如果存在，则更新密码
            existingAdmin.password = '123456';
            await existingAdmin.save();
            console.log('管理员账号密码已更新！');
            process.exit(0);
        } else {
            // 如果不存在，则创建新账号
            const admin = new Admin({
                username: 'admin',
                password: '123456'
            });
            await admin.save();
            console.log('管理员账号创建成功！');
            process.exit(0);
        }
    } catch (error) {
        console.error('操作失败:', error);
        process.exit(1);
    }
}

createAdmin(); 