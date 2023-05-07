import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit {
  // posts = [
  //   {id: '123', title: 'First Post', content: 'This is coming from the server'},
  //   {id: '124', title: 'Second Post', content: 'This is coming from  the 2nd server'},
  //   {id: '125', title: 'Third Post', content: 'This is coming from the 3rd server'},
  //   {id: '126', title: 'Fourth Post', content: 'This is coming from the 4th server'},
  //   {id: '127', title: 'Fifth Post', content: 'This is coming from the 5th server'},
  // ]

  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  // private postSub = ;
  constructor(private postService: PostsService) { }

  ngOnInit() {
  }

  get(){
    this.posts = this.postService.getPosts();
    this.postService.getPostUpdateListener().subscribe((posts: Post[]) =>{
      this.posts = posts;
    })
  }

}
