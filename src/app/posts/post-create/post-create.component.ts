import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
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
          this.post = { id: data._id, title: data.title, content: data.content }
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

  onSelectFile(event: any) {

    const file: File = event.target.files[0];

    if (file) {

      this.image = file.name;

      const formData = new FormData();

      formData.append("thumbnail", file);

      const upload$ = this.http.post("/api/thumbnail-upload", formData);

      upload$.subscribe();
    }

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
      this.postService.updatePost(this.postId, form.value.content, form.value.image);
    }
    form.reset();
  }

}
