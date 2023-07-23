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
  private postUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`
    this.http.get<{ message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams
    ).pipe(map(postData => {
      return {
        posts: postData.posts.map((post) => {
          return {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath
          };
        }),
        maxPosts: postData.maxPosts
      };
    }))
      .subscribe(response => {
        this.posts = response.posts;
        this.postUpdated.next({posts: [...this.posts], postCount: response.maxPosts });
      })
    // return [...this.posts]
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string
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
    .post<{ message: string, post: Post }>
    (
      'http://localhost:3000/api/posts',
      postData
    )
      .subscribe(responseData => {
      // const post: Post = {
      //   id: responseData.post.id,
      //   title: title,
      //   content: content,
      //   imagePath: responseData.post.imagePath
      // };
      // this.posts.push(post);
      // this.postUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else{
      postData = { id: id, title: title, content: content, imagePath: image };
    }
    this.http.put<{ message: string }>('http://localhost:3000/api/posts/' + id, postData)
    .subscribe(response => {
      // const updatedPosts = [...this.posts];
      // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
      // const post: Post = {
      //   id: id,
      //   title: title,
      //   content: content,
      //   imagePath: "response.imagePath"
      // };
      // updatedPosts[oldPostIndex] = post;
      // this.posts = updatedPosts;
      // this.postUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  deletePost(id: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + id);
    // .subscribe((responseData) => {
    //   console.log("deleted");
    //   const updatedPosts = this.posts.filter(post => post.id !== id)
    //   this.posts = updatedPosts;
    //   this.postUpdated.next([...this.posts]);
    // });
  }
}
