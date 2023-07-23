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
    ).pipe(map((postData) =>
    {
      return postData.posts.map((post) => {
        return {
          id: post._id,
          title: post.title,
          content: post.content,
          imagePath: post.imagePath
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
    return this.http.get<{
      _id: string,
      title: string,
      content: string
    }>('http://localhost:3000/api/posts/' + id);
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
    .post<{ message: string, post: Post }>(
      'http://localhost:3000/api/posts',
      postData)
      .subscribe(responseData => {
      const post: Post = {
        id: responseData.post.id,
        title: title,
        content: content,
        imagePath: responseData.post.imagePath
      };
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content, imagePath: null };
    this.http.put<{ message: string }>('http://localhost:3000/api/posts/' + id, post).subscribe((responseData) => {
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
