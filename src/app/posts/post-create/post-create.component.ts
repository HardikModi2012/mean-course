import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
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
  form: FormGroup;
  imagePreview: string | ArrayBuffer;
  // @Output() postCreated = new EventEmitter<Post>();
  constructor(
    private postService: PostsService,
    private http: HttpClient,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'content': new FormControl(null, [Validators.required]),
      'image': new FormControl(null),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.postId = paramMap.get('id');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((data) => {
          this.isLoading = false;
          this.post = {
            id: data._id,
            title: data.title,
            content: data.content,
            imagePath: data.imagePath
          };
          this.form.setValue({ title: this.post.title, content: this.post.content, image: this.post.imagePath  })
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

  // onSelectFile(event: any) {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     this.image = file.name;
  //     const formData = new FormData();
  //     formData.append("thumbnail", file);
  //     const upload$ = this.http.post("/api/thumbnail-upload", formData);
  //     upload$.subscribe();
  //   }
  // }

  onSavePost() { //form: NgForm
    if (this.form.invalid) {
      return;
    }
    // const post: Post = {
    //   title: form.value.title,
    //   content: form.value.content,
    // }
    // this.postCreated.emit(post);
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file);
  }

}
