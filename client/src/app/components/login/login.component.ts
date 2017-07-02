import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  processing: boolean = false;
  messageClass: string;
  message: string;
  priviousUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard
  ) { 
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

   // 开启表单
  enableForm() {
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
  }

  // 关闭表单
  disableForm() {
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
  }
  
  onLoginSubmit() {
    this.processing = true;
    this.disableForm();
    const user = {
      username: this.form.get('username').value,
      password: this.form.get('password').value
    };

    this.authService.login(user).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.authService.storeUserData(data.token, data.user); // 将后台返回的信息存在localStorage中
        setTimeout(() => {
          if (this.priviousUrl) { // 如果这个url存在的话，则登录之后跳转到先前的页面
            this.router.navigate([this.priviousUrl]);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }, 1000);
      }
    })
  }

  ngOnInit() {
    // 在这个组件初始化前先检测重定向url是否存在
    if (this.authGuard.redirectUrl) {
      this.messageClass = 'alert alert-danger';
      this.message = '请先登录再能查看';
      this.priviousUrl = this.authGuard.redirectUrl; // 将重定向来的url保存
      this.authGuard.redirectUrl = undefined; // 然后将重定向的url清空
    }
  }

}
