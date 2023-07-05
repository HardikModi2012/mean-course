import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts'
    ).pipe(map((postData) => {
      return postData.posts.map((post) => {
        return {
          id: post._id,
          title: post.title,
          content: post.content,
        }
      })
    }))
      .subscribe((response) => {
        this.posts = response;
        this.postUpdated.next([...this.posts]);
      })
    // return [...this.posts]
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string }>('http://localhost:3000/api/posts/' + id);
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, content: string, image: any) {
    const post: Post = { id: null, title: title, content: content };
    this.http.post<{ message: string }>('http://localhost:3000/api/posts', post).subscribe((responseData) => {
      console.log(responseData.message);
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content };
    this.http.put<{ message: string }>('http://localhost:3000/api/posts/' + id, post).subscribe((responseData) => {
      console.log(responseData.message);
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
      this.router.navigate(["/"]);

    });
  }

  deletePost(id: string) {
    this.http.delete('http://localhost:3000/api/posts/' + id).subscribe((responseData) => {
      console.log("deleted");
      const updatedPosts = this.posts.filter(post => post.id !== id)
      this.posts = updatedPosts;
      this.postUpdated.next([...this.posts]);
    });
  }
}
