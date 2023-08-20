import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "src/app/posts/post.model";
import { PostsService } from "src/app/posts/posts.service";
import { AuthService } from "../signup/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  isLoading = false;

  constructor(private authS: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {}

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      this.authS.loginUser(form.value.email, form.value.password);
    }
  }
}
