import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  message: string; // 提交之后返回的消息
  messageClass: string;

  processing: boolean = false; // 是否正在提交，组织多次提交

  emailValid: boolean = true; // 邮箱是否有效
  emailMessage: string;

  usernameValid: boolean = true; // 用户名是否有效
  usernameMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm(); // 创建angular表单当组件加载时
   }

  createForm() {
    this.form = this.formBuilder.group({
      username: [
        '', 
        Validators.compose([ // 多个验证使用 'Validators.compose()' 方法
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
          this.validateUsername                         
        ])
      ],
      email: [
        '', 
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
          this.validateEmail   // 自定义验证函数                         
        ])
      ],
      password: [
        '', 
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30),
          this.validatePassword                         
        ])
      ],
      confirm: [
        '', 
        Validators.required
      ]
    }, { validator: this.matchingPasswords('password', 'confirm')}); // 添加自定义验证来匹配密码
  }

  // 自定义验证
  validateUsername(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9\_]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateUsername: true };
    }
  }

  validateEmail(controls) {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateEmail: true };
    }
  }

  validatePassword(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9!@#$%^&*]{6,30}$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validatePassword: true };
    }
  }

  // 验证确认密码是否匹配
  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      if (group.controls[password].value === group.controls[confirm].value) {
        return null;
      } else {
        return { matchingPasswords: true };
      }
    }
  }

  // 开启表单
  enableForm() {
    this.form.controls['username'].enable();
    this.form.controls['email'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
  }

  // 关闭表单
  disableForm() {
    this.form.controls['username'].disable();
    this.form.controls['email'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
  }

  // 提交表单
  onRegisterSubmit() {
    /**
     * 当点击 '提交' 时
     * processing设置为true
     * 然后禁用表单，不允许输入
     */
    this.processing = true;
    this.disableForm();     
    const user = {
      username: this.form.get('username').value,
      email: this.form.get('email').value,
      password: this.form.get('password').value
    };

    this.authService.registerUser(user).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.enableForm(); // 如果有错误则开启输入
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => { // 成功注册后跳转到 '/login' 页面
          this.router.navigate(['/login']);
        }, 1000);
      }
      // console.log('data', data);
    })
  }

  checkEmail() {
    this.authService.checkEmail(this.form.get('email').value).subscribe(data => {
      if (!data.success) {
        this.emailValid = false;
        this.emailMessage = data.message;
      } else {
        this.emailValid = true;
        this.emailMessage = data.message;
      }
    });
  }

  checkUsername() {
    this.authService.checkUsername(this.form.get('username').value).subscribe(data => {
      if (!data.success) {
        this.usernameValid = false;
        this.usernameMessage = data.message;
      } else {
        this.usernameValid = true;
        this.usernameMessage = data.message;
      }
    });
  }

  ngOnInit() {
  }

}
