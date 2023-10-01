import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "./auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  isLoading = false;
  private authStatusSub!: Subscription;

  constructor(private authS: AuthService) {}

  ngOnInit() {
   this.authStatusSub = this.authS.getAuthStatusListener().subscribe(
    authStatus => {
      this.isLoading = false;
    }
   )
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authS.createUser(form.value.email, form.value.password);    
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
