import { Component } from '@angular/core';
import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mean-course';
  // storedPosts: Post[] =[];

  // onAddedPost(data){
  //   this.storedPosts.push(data);
  // }
}
