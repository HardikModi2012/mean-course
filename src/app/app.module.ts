import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PostsComponent } from './posts/posts.component';
import { MessageComponent } from 'src/shared/message/message.component';
import { CourseListComponent } from './course-list/course-list.component';
import { RandomFaqComponent } from './random-faq/random-faq.component';

@NgModule({
  declarations: [		
    AppComponent,
    PostsComponent,
    MessageComponent,
      CourseListComponent,
      RandomFaqComponent
   ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
