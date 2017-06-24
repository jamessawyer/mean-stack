import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.createForm();
   }

  createForm() {
    this.form = this.formBuilder.group({
      username: [
        '', 
        Validators.compose([ // 多个验证使用 'Validators.compose()' 方法
          Validators.required,
          Validators.minLength(3),
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
    }, { validator: this.matchingPasswords('password', 'confirm')});
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

  onRegisterSubmit() {
    console.log(this.form);
  }

  ngOnInit() {
  }

}
