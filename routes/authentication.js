const User = require('../models/user');

module.exports = (router) => {

    // postman中输入地址 'http://localhost:8080/authencation/register'
    router.post('/register', (req, res) => {

        if (!req.body.email) { // 检查是否提供邮箱
            res.json({ success: false, message: '请输入邮箱' });
        } else {
            if (!req.body.username) { // 检查是否输入用户名
                res.json({ success: false, message: '请输入用户名' });
            } else {
                if (!req.body.password) { // 检查是否输入密码
                   res.json({ success: false, message: '请输入密码' }); 
                } else {
                    let user = new User({
                        email: req.body.email.toLowerCase(),
                        username: req.body.username.toLowerCase(),
                        password: req.body.password
                    });

                    // mongoose 保存到数据库
                    user.save((err) => {
                        if (err) {
                            // code 11000 表示用户已经存在
                            if (err.code === 11000) {
                                res.json({ success: false, message: '该用户名或邮箱已存在' })
                            } else {
                                // 更加具体的错误信息反馈
                                 if (err.errors) {
                                    if (err.errors.email) {
                                        res.json({ success: false, message: err.errors.email.message })
                                    } else if (err.errors.username) {
                                        res.json({ success: false, message: err.errors.username.message })
                                    } else if (err.errors.password) {
                                        res.json({ success: false, message: err.errors.password.message })
                                    }
                                } else {
                                    res.json({ success: false, message: '保存用户失败：', err})
                                }
                            }
                            
                        } else {
                            res.json({ success: true, message: '保存成功' });
                        }
                    })
                    // console.log(req.body)
                    // res.send('hello world');
                }
            }
        }
    })
    return router;
}
