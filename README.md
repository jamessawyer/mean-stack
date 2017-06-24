"# mean-stack" 

## 分支介绍

### register-api

1. **`models/user.js`** 定义 'User'(注册用户) 数据模型： 提供后端验证(email, 用户名, 密码)
2. 使用 **`body-parser`** (express中间件) 对 **`req.body`** 进行解析
3. 使用 **`bcrypt-nodejs`** (express中间件) 对密码进行加密(使用mongoose Schema中间件进行处理)
4. **`routes/authentication.js`** 自定义路由中间件，主要用于 注册(register)时的 post 请求进行处理

schema 中间件的写法:
```
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

```

schema 原型链方法:

```
/**
 * schema添加方法 
 * 用来对比密码是否正确, 用于Login
 */
userSchema.method.comparePassword = (password) => {
    return bcrypt.compareSync(password, this.password);
}
```