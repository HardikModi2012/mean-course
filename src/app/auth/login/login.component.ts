import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from 'src/app/posts/post.model';
import { PostsService } from 'src/app/posts/posts.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  samplePost = 'No Content!!!';
  enteredTitle = "";
  enteredContent = "";
  image = "";
  private mode = "create";
  private postId: string;
  post: Post;
  isLoading = false;
  // @Output() postCreated = new EventEmitter<Post>();
  constructor(private postService: PostsService, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((data) => {
          this.isLoading = false;
          this.post = {
            id: data._id,
            title: data.title,
            content: data.content,
            imagePath: null
          }
        })
      }
      else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  savePost(event: HTMLTextAreaElement) {
    this.samplePost = event.value;
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // const post: Post = {
    //   title: form.value.title,
    //   content: form.value.content,
    // }
    // this.postCreated.emit(post);
    if (this.mode === 'create') {
      this.postService.addPost(form.value.title, form.value.content, form.value.image);
    } else {
      // this.postService.updatePost(this.postId, form.value.content, form.value.image);
    }
    form.reset();
  }

}
