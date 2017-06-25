"# mean-stack" 

## 分支介绍

1. 服务端设置 					(server-setup)					
2. 客户端路由设置
3. 注册表单样式，Reactive Form  (register-form)
4. 注册表单api                  (register-api)
	- 后端数据结构model
	- 后端restful请求处理
	
5. 注册http， 对提交表单进行处理 (register-http)
   - post表单
   - 对表单有效性进行处理
   - 自定义服务,对http请求进行处理

6. 登录验证 对登录信息进行比对验证 (login-authentication) 
  = 登录页面表单，登录验证
  - 登录查询数据库
  - 登录跳转等

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

### register-form

1. reactive form表单的使用
  - **`ReactiveFormsModule`**模块， **`FormBuilder`**, **`FormGroup`**, **`FormControl`**等指令
  - **`Validators`** 自带的表单验证，以及自己添加的表单验证方式 **`Validators.compose()`** 多个验证方法

2 **`[formGroup]="form"`** 指令的使用
3 **`form.controls.username.errors?.required`** 等表单验证的方式
4 **`?.`** 安全验证符号的使用


### register-http

2017年6月25日 12:34:04

跨域问题：

1. 使用 **`cors`** npm 包对跨域进行简单的处理

```
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:4200'
}))
```

客户端：
 
1. 使用**`Http`**模块，Restful操作
2. **`client/src/app/services/auth.service.ts`** 对注册进行验证的服务
3. **`registerUser(user)`** 注册用户, **`POST`**请求
4. **`checkEmail()`** 对邮箱有效性进行检测，邮箱是否已经被注册 **`GET`** 请求
5. **`checkUsername()`** 对用户名进行检测， 用户名是否已经被注册 **`GET`** 请求
6. **`client/src/app/components/register.component.ts`** 对表单提交进行处理， 禁止多次提交， 另外添加新的验证


服务端：

1. **`routes/authentication.js`** 新增对 **`/authentication/checkEmail/:email`** GET请求的处理
2. **`routes/authentication.js`** 新增对 **`/authentication/checkUsername/:username`** GET请求的处理
3. **`routes/authentication.js`** 对Mongo数据库进行查询

使用angular-cli命令行生成 service:

```
// auth是服务的名称
ng g service auth 
```

注意产生的服务需要手动的添加到 providers中，本分支之间添加到 'App.module.ts' 中的 '@NgModule' 元数据 providers中

**改动：**

1. 对用户名长度改动： 从最少3个字符，改为了至少2个字符


### login-authentication

2017年6月25日 22:59:08

客户端：
  1. 新增 'login', 'profile' 组件
  2. 新增 **`angular2-flash-messages`** npm包提供跳转消息提示
  3. 新增 **`angular2-jwt`** npm包， 用于显示和隐藏页面元素,根据是否登录状态
  4. 将用户登录成功之后，后台返回的 'token' 存储在localStorage中
  5. 对带权限验证的请求，使用 **`RequestOptions`** 和 **`Headers`**添加头信息



服务端：
  1. 新增 **`jsonwebtoken`** npm包, 返回 token 信息给前端
  2. 新增 **`\authentication\login`** 后端路由
  3. 新增 **`\authentication\profile`** 后端路由
  4. 自定义中间件对前端提交的token信息和后台进行比对，来确认是否登录， 使用 **`jwt`**
