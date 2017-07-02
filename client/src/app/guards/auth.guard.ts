// 确保用户是登录状态
import { Injectable } from '@angular/core';
import {
    CanActivateChild, 
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivateChild {

    redirectUrl: string; // 从定向之前的url

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}
    canActivateChild(
        router: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        if (this.authService.loggedIn()) { // 如果是登录状态
            return true;        
        } else {
            this.redirectUrl = state.url; // url快照, 重定向之前的url
            this.router.navigate(['/login']);
            return false;
        }
    }
}