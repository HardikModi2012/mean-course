import { Component } from '@angular/core';
import { Post } from './posts/post.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  path = environment.path;

  title = 'mean-course';

  constructor(){
    console.log("environ", this.path);

  }
  // storedPosts: Post[] =[];

  // onAddedPost(data){
  //   this.storedPosts.push(data);
  // }
}
