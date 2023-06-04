import { NgModule } from "@angular/core";
import { PostsListComponent } from "./posts/posts-list/posts-list.component";
import { Routes, RouterModule } from "@angular/router";
import { PostCreateComponent } from "./posts/post-create/post-create.component";


const routes: Routes = [
  { path: '', component: PostsListComponent},
  { path: 'create', component: PostCreateComponent},
  { path: '**', component: PostsListComponent},
  { path: '', component: PostsListComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule{}
