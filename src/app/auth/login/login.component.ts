import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "src/app/posts/post.model";
import { PostsService } from "src/app/posts/posts.service";
import { AuthService } from "../signup/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  isLoading = false;
  private authStatusSub!: Subscription;

  constructor(private authS: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.authStatusSub = this.authS.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
     )
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authS.loginUser(form.value.email, form.value.password);
  }


  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
