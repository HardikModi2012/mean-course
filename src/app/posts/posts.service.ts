import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts() {
    // this.http.get<Post[]>('').subscribe((response) => {
    //   this.posts = response;
    // })
    return [...this.posts]
  }

  getPostUpdateListener(){
   return this.postUpdated.asObservable();
  }
  addPost(title: string, content: string){
    const post: Post = {title: title, content: content};
    this.posts.push(post);
    this.postUpdated.next([...this.posts]);
  }
}
