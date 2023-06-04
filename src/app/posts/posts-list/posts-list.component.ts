import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit, OnDestroy {
  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  private postSub: Subscription ;
  constructor(private postService: PostsService) { }

  ngOnInit() {
    this.postService.getPosts();
    this.postSub= this.postService.getPostUpdateListener().subscribe((posts: Post[]) =>{
      this.posts = posts;
      console.log("posts", this.posts);
    })
  }

  editPost(){}

  deleteRecord(id: string){
    // this.postSub= this.postService.deletePost(id).subscribe(() =>{
    //   this.posts = posts;
    //   console.log("posts", this.posts);
    // })
  }

  ngOnDestroy(): void { // to prevent memory leaks
      this.postSub.unsubscribe();
  }

}
