const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

/**
 * titleLengthChecker: 标题长度验证 1- 30
 */
let titleLengthChecker = (title) => {
    if (!title) {
        return false;
    } else {
        if (title.length < 1 || title.length > 50) {
            return false;
        } else {
            return true;
        }
    }
}

/**
 * 文章标题
 */
const titleValidators = [
    {
        validator: titleLengthChecker, message: '文章标题长度应该在1-50个字符'
    }
]

/**
 * 文章内容长度确认，不少于5个字,不多于3000字
 */
let bodyLengthChecker = (body) => {
    if (!body) {
        return false;
    } else {
        if (body.length < 1 || body.length > 3000) {
            return false;
        } else {
            return true;
        }
    }
}

const bodyValidators = [
    {
        validator: bodyLengthChecker, message: '文章内容长度不多于3000个字'
    }
]

/**
 * 评论
 */
let commentLengthChecker = (comment) => {
    if (!comment[0]) {
        return false;
    } else {
        if (comment[0].length < 1 || comment[0].length > 200) {
            return false;
        } else {
            return true;
        }
    }
}

const commentValidators = [
    {
        validator: commentLengthChecker, message: '评论不能超过200个字符'
    }
]

const blogSchema = new Schema({
    title: { // 文章标题
        type: String,
        required: true,
        validator: titleValidators
    },
    body: { // 文章内容
        type: String,
        required: true,
        validate: bodyValidators
    },
    createdBy: { // 文章作者
        type: String,
    },
    createdAt: { // 文章创建时间
        type: Date,
        default: Date.now()
    },
    likes: { // 点赞人数
        type: Number,
        default: 0
    },
    likedBy: { // 点赞列表
        type: Array
    },
    dislikes: { // 反对人数
        type: Number,
        default: 0
    },
    dislikedBy: { // 反对列表
        type: Array
    },
    comments: [ // 文章评论
        {
            comment: { type: String, validate: commentValidators },
            commentator: { type: String }
        }
    ]
});


module.exports = mongoose.model('Blog', blogSchema);
