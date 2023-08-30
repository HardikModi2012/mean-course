import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/signup/auth.service";
@Component({
  selector: "app-posts-list",
  templateUrl: "./posts-list.component.html",
  styleUrls: ["./posts-list.component.css"],
})
export class PostsListComponent implements OnInit, OnDestroy {
  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  private postSub: Subscription;
  isLoading = false;
  isAuthenticated: boolean = false;
  private authListenerSubs: Subscription;
  constructor(private postService: PostsService, private authS: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.postSub = this.postService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
    this.isAuthenticated = this.authS.getIsAuth();
    this.authListenerSubs = this.authS
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      });
  }

  editPost() {}

  deleteRecord(id: string) {
    this.postService.deletePost(id);
  }

  ngOnDestroy(): void {
    // to prevent memory leaks
    this.postSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }
}
