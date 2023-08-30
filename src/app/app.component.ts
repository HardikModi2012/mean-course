import { Component, OnInit } from '@angular/core';
import { Post } from './posts/post.model';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth/signup/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  path = environment.path;

  title = 'mean-course';

  constructor(private authS: AuthService){
    console.log("environ", this.path);
  }

  ngOnInit(){
    this.authS.autoAuth();
  }
  // storedPosts: Post[] =[];

  // onAddedPost(data){
  //   this.storedPosts.push(data);
  // }
}
