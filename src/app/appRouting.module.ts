import { NgModule } from "@angular/core";
import { PostsListComponent } from "./posts/posts-list/posts-list.component";
import { Routes, RouterModule } from "@angular/router";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { CreateCourseComponent } from "./course-list/create-course/create-course.component";
import { AuthGuard } from "./Core/guards/auth.guard";


const routes: Routes = [
  { path: '', component: PostsListComponent}, // , canActivate: [AuthGuard]
  { path: 'posts', component: PostsListComponent}, // , canActivate: [AuthGuard]
  { path: 'create', component: PostCreateComponent},
  { path: 'edit/:id', component: PostCreateComponent},
  { path: 'create-course', component: CreateCourseComponent},
  { path: '**', component: PostsListComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule{}
