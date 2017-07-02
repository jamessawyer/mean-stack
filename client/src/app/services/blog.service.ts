import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthService } from './auth.service';

@Injectable()
export class BlogService {
    options: object;
    domain: string = this.authService.domain;

    constructor(
        private authService: AuthService,
        private http: Http
    ) { }
    
    createAuthenticationHeaders() {
        this.authService.loadToken();
        this.options = new RequestOptions({
          headers: new Headers({
            'Content-Type': 'application/json', // Format set to JSON
            'authorization': this.authService.authToken // Attach token
          })
        });
    }



    newBlog(blog) {
        this.createAuthenticationHeaders();
        return this.http.post(this.domain + '/blogs/newBlog', blog, this.options).map(res => res.json());
    }
}