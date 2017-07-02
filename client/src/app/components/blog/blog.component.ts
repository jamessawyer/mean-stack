import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  form: FormGroup;
  message: string;
  messageClass: string;
  newPost: boolean = false;
  loadingBlogs: boolean = false;
  username: string;
  processing: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService,
    private router: Router
  ) {
    this.createBlogForm();
  }

  
  // 创建写文章表单
  createBlogForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(3000)
      ])]
    })
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => { // 获取作者名
      console.log('profile', profile);
      if (!profile.success) {
        this.authService.logout();
        this.router.navigate(['/login']);
        return;
      } else {
        this.username = profile.user.username;
      }
    })
  }

  
  newBlogForm() {
    this.newPost = true;
  }

  // 加载文章
  reloadBlogs() {
    this.loadingBlogs = true;

    // 从数据库中获取所有的blog
    // 此处使用setTimeout模拟请求
    setTimeout(() => {
      this.loadingBlogs = false;
    }, 3000);
  }

  disableForm() {
    this.form.get('title').disable();
    this.form.get('body').disable();    
  }

  enableForm() {
    this.form.get('title').enable();
    this.form.get('body').enable();    
  }

  // 提交新文章
  onBlogSubmit() {
    this.processing = true;
    this.disableForm();
    const blog = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      createdBy: this.username
    }
    this.blogService.newBlog(blog).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.enableForm();
        this.processing = false;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.newPost = false;
          this.processing = false;
          this.form.reset();
          this.enableForm();
        }, 1000);
        
      }
    })
    console.log('blog submit')
  }

  // 返回
  goBack() {
    
    window.location.reload();
  }

  draftComment() {

  }

  // 文章评论提交
  onCommentSubmit() {

  }
}