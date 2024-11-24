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
  { path: "posts", component: PostsListComponent, title: "posts" }, // , canActivate: [AuthGuard]
  { path: "create", component: PostCreateComponent, title: "create-post" },
  {
    path: "edit/:id",
    component: PostCreateComponent,
    title: "edit",
    canActivate: [AuthGuard],
  },
  // {
  //   path: "edit/:id/:courseId",   // by doing this way we can pass multiple id in queryParams
  //   component: PostCreateComponent,
  //   canActivate: [AuthGuard],
  // },
  {
    path: "create-course",
    component: CreateCourseComponent,
    title: "new course",
    canActivate: [AuthGuard],
  },
  { path: "login", component: LoginComponent, title: "login" },
  { path: "signup", component: SignupComponent, title: "signup" },
  { path: "**", component: PostsListComponent, title: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
