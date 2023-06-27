import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../Models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseApiURL = '';
constructor(private http: HttpClient) { }

  public login(email: string, password: string){
    return this.http.post<IUser>(`${this.baseApiURL }`, {
      email: email,
      password: password,
    })
  }
}
