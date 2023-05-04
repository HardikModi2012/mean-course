import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  isExpanded = true;
constructor() { }

toggleSideNav(){
  this.isExpanded = !this.isExpanded;
}

expandSideNav(){
  this.isExpanded = true;
}

collapseSideNav(){
  this.isExpanded = false
}

}
