import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/signup/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated : boolean = false;
  private authListenerSubs: Subscription;
  constructor(private authS: AuthService) { }

  ngOnInit() {
    this.isAuthenticated = this.authS.getIsAuth();
    this.authListenerSubs = this.authS.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated
    });
  }

  logout(){
    this.authS.logOut();
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }

}
