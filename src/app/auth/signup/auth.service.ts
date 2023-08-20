import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { authData } from "./auth-data.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient) {}

  createUser(email: string, password: string) {
    const authData: authData = { email: email, password: password };
    this.http
      .post("http://localhost:3000/api/user/signup", authData)
      .subscribe((response) => {
        console.log(response);
      });
  }

  loginUser(email: string, password: string) {
    const authData: authData = { email: email, password: password };
    this.http
      .post("http://localhost:3000/api/user/login", authData)
      .subscribe((response) => {
        console.log(response);
      });
  }
}
