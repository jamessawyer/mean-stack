// 确保用户未登录状态
// 比如 注册 组件只有是未登录状态才显示， 登录状态时不显示
import { Injectable } from '@angular/core';
import {
  CanActivateChild, 
  Router
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class NotAuthGuard implements CanActivateChild {

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}
    canActivateChild() {
        if (this.authService.loggedIn()) { // 如果是登录状态 则返回false 跳转到主页
            this.router.navigate(['/']);
            return false;
        } else {
            return true;
        }
    }
}