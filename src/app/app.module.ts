import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { PostsComponent } from './posts/posts.component';
import { MessageComponent } from 'src/shared/message/message.component';
import { CourseListComponent } from './course-list/course-list.component';
import { RandomFaqComponent } from './random-faq/random-faq.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { HeaderComponent } from './header/header.component';
import { PostsListComponent } from './posts/posts-list/posts-list.component';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { MatModule } from './appModules/mat.module';
import { AppRoutingModule } from './appRouting.module';
import { CreateCourseComponent } from './course-list/create-course/create-course.component';
import { LoginComponent } from './auth/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    MessageComponent,
    CourseListComponent,
    RandomFaqComponent,
    PostCreateComponent,
    HeaderComponent,
    PostsListComponent,
    CreateCourseComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CdkAccordionModule,
    HttpClientModule,
    MatModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
