import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { HttpClient } from '@angular/common/http';

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
  // @Output() postCreated = new EventEmitter<Post>();
  constructor(private postService: PostsService, private http: HttpClient) { }

  ngOnInit() {
  }

  savePost(event: HTMLTextAreaElement) {
    this.samplePost = event.value;
  }

  onSelectFile(event: any){

      const file:File = event.target.files[0];

      if (file) {

          this.image = file.name;

          const formData = new FormData();

          formData.append("thumbnail", file);

          const upload$ = this.http.post("/api/thumbnail-upload", formData);

          upload$.subscribe();
      }

  }

  addPost(form: NgForm){
    if(form.invalid){
      return;
    }
    // const post: Post = {
    //   title: form.value.title,
    //   content: form.value.content,
    // }
    // this.postCreated.emit(post);
    this.postService.addPost(form.value.title,form.value.content, form.value.image);
    form.reset();
  }

}
