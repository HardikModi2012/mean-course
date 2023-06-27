import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { clientStorage } from 'src/app/Core/ClientStorage';
import { IUser } from 'src/app/Models/user.interface';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  constructor(private account: AccountService, private route: Router) { }

  ngOnInit() {
    clientStorage.removeUserData();
  }

  onSubmit(){

    let formValue = this.form.value;

    this.account.login(formValue.email ?? '', formValue.password ?? '').subscribe({
      next: (data: IUser) => {
        // this.loader.close();
        if(data && data != undefined && data != null){
          clientStorage.setUserData(data);
          clientStorage.setAuthenticationToken(data.token);
          this.route.navigateByUrl('') // home page
        }
      },
      error: (err: any )=> {

      },
      complete: () => {
        // this.loader.close();
      }
    })

  }

}
