import { NgModule } from "@angular/core";
import { PostsListComponent } from "./posts/posts-list/posts-list.component";
import { Routes, RouterModule } from "@angular/router";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { CreateCourseComponent } from "./course-list/create-course/create-course.component";
import { AuthGuard } from "./Core/guards/auth.guard";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";

const routes: Routes = [
  { path: "", component: PostsListComponent }, //
  { path: "posts", component: PostsListComponent }, // , canActivate: [AuthGuard]
  { path: "create", component: PostCreateComponent },
  {
    path: "edit/:id",
    component: PostCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "create-course",
    component: CreateCourseComponent,
    canActivate: [AuthGuard],
  },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "**", component: PostsListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
