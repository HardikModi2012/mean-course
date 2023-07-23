import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit, OnDestroy {
  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  private postSub: Subscription;
  isLoading = false;
  totalPosts = 0;
  pageSize = 1;
  currentPage = 1;
  pageSizeOptions = [1,2, 5, 10];
  pageEvent: PageEvent;
  constructor(private postService: PostsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.pageSize, this.currentPage);
    this.postSub = this.postService.getPostUpdateListener().subscribe((postData: {posts: Post[], postCount:number }) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    })
  }

  editPost() { }

  deleteRecord(id: string) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(()=> {
      this.postService.getPosts(this.pageSize, this.currentPage)
    })
  }

  handlePageEvent(e: PageEvent) {
    this.isLoading = true;
    this.currentPage = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.postService.getPosts(this.pageSize, this.currentPage);
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  ngOnDestroy(): void { // to prevent memory leaks
    this.postSub.unsubscribe();
  }

}
