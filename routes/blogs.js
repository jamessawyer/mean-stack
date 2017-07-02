const User = require('../models/user');
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {
    router.post('/newBlog', (req, res) => {
        if (!req.body.title) {
            res.json({ success: false, message: '没有填写标题' });
        } else {
            if (!req.body.body) {
                res.json({ success: false, message: '没有填写内容' });
            } else {
                if (!req.body.createdBy) {
                    res.json({ success: false, message: '没有评论人' });
                } else {
                    const blog = new Blog({
                        title: req.body.title,
                        body: req.body.body,
                        createdBy: req.body.createdBy
                    });
                    blog.save((err) => {
                        if (err) {
                            if (err.errors) { // 如果验证有错误
                                if (err.errors.title) {
                                    res.json({ success: false, message: err.errors.title.message });
                                } else {
                                    if (err.errors.body) {
                                        res.json({ success: false, message: err.errors.body.message });
                                    } else {
                                        if (err.errors.createdBy) {
                                            res.json({ success: false, message: err.errors.createdBy.message });
                                        } else {
                                            res.json({ success: false, message: err });
                                        }
                                    }
                                }
                            }
                        } else {
                            res.json({ success: true, message: '文章保存成功' })
                        }
                    })
                }
            }
        }
    })
    return router;
}