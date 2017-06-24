const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs'); // 用于密码加密

/**
 * emailLengthChecker: 邮箱长度判断
 * validEmailChecker: 邮箱有效性判断
 * emailValidtors： schema中的验证数组
 */
let emailLengthChecker = (email) => {
    if (!email) {
        return false;
    } else {
        if (email.length < 5 || email.length > 30) {
            return false;
        } else {
            return true;
        }
    }
}
let validEmailChecker = (email) => {
    if (!email) {
        return false;
    } else {
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
}
/**
 * email 验证器数组
 */
const emailValidators = [
    {
        validator: emailLengthChecker, message: 'email 长度应该在5-30个字符'
    },
    {
        validator: validEmailChecker, message: '请输入一个有效的email'
    }
]

/**
 * 用户名验证
 */
let usernameLengthChecker = (username) => {
    if (!username) {
        return false;
    } else {
        if (username.length < 3 || username.length > 20) {
            return false;
        } else {
            return true;
        }
    }
}
let validUsernameChecker = (username) => {
    if (!username) {
        return false;
    } else {
        const regExp = new RegExp(/^[a-zA-Z0-9\_]+$/); // 数字字母或下划线       
        return regExp.test(username);
    }
}
const usernameValidators = [
    {
        validator: usernameLengthChecker, message: '用户名长度应该在3-20个字符'
    },
    {
        validator: validUsernameChecker, message: '用户名为数字字母或下划线'
    }
]

/**
 * 密码验证
 */
let pwdLengthChecker = (pwd) => {
    if (!pwd) {
        return false;
    } else {
        if (pwd.length < 8 || pwd.length > 35) {
            return false;
        } else {
            return true;
        }
    }
}
let validPwdChecker = (pwd) => {
    if (!pwd) {
        return false;
    } else {
        // const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);  
        const regExp = new RegExp(/^[a-zA-Z0-9!@#$%^&*]{6,30}$/);   
        return regExp.test(pwd);
    }
}
const pwdValidators = [
    {
        validator: pwdLengthChecker, message: '密码长度应该在8-35个字符'
    },
    {
        validator: validPwdChecker, message: '存在非法字符'
    }
]

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: emailValidators // 验证使用
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: usernameValidators
    },
    password: {
        type: String,
        required: true,
        validate: pwdValidators
    }
});

// schema 中间件
// 不能使用arrow function!!!
// (next) => {} 将报错
userSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    // 加密
    bcrypt.hash(this.password, null, null, (err, hash) => {
        if (err) {
            return next();
        }
        this.password = hash; // 将hash值赋给密码
        next();
    })
})

/**
 * schema添加方法 
 * 用来对比密码是否正确, 用于Login
 */
userSchema.method.comparePassword = (password) => {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);
