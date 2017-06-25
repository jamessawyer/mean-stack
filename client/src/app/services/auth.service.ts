import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt'; // 用于隐藏和显示部分按钮
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  domain: string = 'http://localhost:8080';
  authToken: string;
  user: object;
  optinons;

  constructor(
    private http: Http
  ) { }

  // 当需要带 header 信息时，调用这个方法 比如访问 个人中心
  // headers 一般在权限(可访问那些内容)中会使用到
  createAuthenticationHeaders() {
    this.loadToken();
    this.optinons = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authToken
      })
    })
  }

  // 从localStorage中获取 token 信息
  loadToken() {
    this.authToken = localStorage.getItem('token');
  }

  // 注册用户 POST请求
  registerUser(user) {
    return this.http.post(this.domain + '/authentication/register', user).map(res => res.json());
  }

  // 验证用户名 GET请求
  checkUsername(username) {
    return this.http.get(this.domain + '/authentication/checkUsername/' + username).map(res => res.json());
  }

  // 验证邮箱 GET请求
  checkEmail(email) {
    return this.http.get(this.domain + '/authentication/checkEmail/' + email).map(res => res.json());
  }

  // 将用户信息存在localStorage中
  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  // 登录
  login(user) {
    return this.http.post(this.domain + '/authentication/login', user).map(res => res.json());
  }

  // 退出登录
  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  // 个人中心
  getProfile() {
    // 对需要权限验证的请求 生成头信息
    this.createAuthenticationHeaders();
    // get请求时 带上头信息 this.options
    return this.http.get(this.domain + '/authentication/profile', this.optinons).map(res => res.json());
  }

  // 判断是否为登录状态 angular2-jwt 提供功能
  loggedIn() {
    return tokenNotExpired();
  }
}
