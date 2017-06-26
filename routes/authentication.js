const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

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
                                    res.json({ success: false, message: '保存用户失败：' + err})
                                }
                            }
                            
                        } else {
                            res.json({ success: true, message: '注册成功' });
                        }
                    })
                    // console.log(req.body)
                    // res.send('hello world');
                }
            }
        }
    })

    /**
     * 用于来查询邮箱是否已经存在
     * 反馈给前端
     */
     router.get('/checkEmail/:email', (req, res) => {
         if (!req.params.email) {
             res.json({ success: false, message: '请填写邮箱' });
         } else {
             User.findOne({ email: req.params.email }, (err, user) => {
                 if (err) {
                     res.json({ success: false, message: err });
                 } else {
                     if (user) { // 如果找到该用户，则表示该邮箱已经注册了
                        res.json({ success: false, message: '该邮箱已注册' });
                     } else {
                         res.json({ success: true, message: '有效邮箱' });
                     }
                 }
             })
         }
     })

     /**
     * 用于来查询用户名是否已经存在
     * 反馈给前端
     */
    router.get('/checkUsername/:username', (req, res) => {
        if (!req.params.username) {
            res.json({ success: false, message: '请填写用户名' });
        } else {
            User.findOne({ username: req.params.username }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (user) { // 如果找到该用户，则表示该邮箱已经注册了
                    res.json({ success: false, message: '该用户名已注册' });
                    } else {
                        res.json({ success: true, message: '有效用户名' });
                    }
                }
            })
        }
     })

     /**
      * 登录部分
      */
    router.post('/login', (req, res) => {
        if (!req.body.username) {
            res.json({ success: false, message: '没有输入用户名'});
        } else {
            if (!req.body.password) {
               res.json({ success: false, message: '没有输入密码'}); 
            } else {
                User.findOne({ username: req.body.username }, (err, user) => {
                    if (err) {
                        res.json({ success: false, message: err});
                    } else {
                        if (!user) { // 用户不存在
                            res.json({ success: false, message: '该用户不存在'});
                        } else { // 用户存在则比较密码
                            const validPassword = user.comparePassword(req.body.password);
                            if (!validPassword) {
                                res.json({ success: false, message: '密码不正确' })
                            } else { // 成功的比对，返回一些必要的信息
                                // 返回 token 给前端， 用来证明是 用户 身份
                                const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' });

                                // 返回给前端的数据
                                res.json({ success: true, message: '登录成功', token: token, user: { username: user.username }});
                            }
                        }
                    }
                })
            }
        }
    })

    // 中间件
    // 请求的权限
    router.use((req, res, next) => {
        const token = req.headers['authorization']; // 请求头信息
        if (!token) {
            res.json({ success: false, message: '没有提供token' });
        } else {
            // 使用jwt来解析token 和 config.secret
            jwt.verify(token, config.secret, (err, decoded) => { // decoded为解析的token
                if (err) {
                    res.json({ success: false, message: '无效token ' + err });
                } else {
                    req.decoded = decoded;
                    next();
                }
            })
        }
    })
    // 个人中心
    router.get('/profile', (req, res) => {
       /* req.decoded
        {
            "userId": "594f2afe1894a02394972132",
            "iat": 1498398387,
            "exp": 1498484787
        }*/
        User.findById({ _id: req.decoded.userId })
            .select('username email') // 选择自己想要的信息
            .exec((err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!user) {
                        res.json({ success: false, message: '没有找到该用户' });
                    } else {
                        res.json({ success: true, user: user });
                        /*{ 返回信息
                            "success": true,
                            "user": {
                                "_id": "594f2afe1894a02394972132",
                                "email": "brad@gmail.com",
                                "username": "brad"
                            }
                        }*/
                    }
                }
            })
    })

    return router;
}
