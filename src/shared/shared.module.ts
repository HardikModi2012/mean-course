import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarService } from './services/sidebar.service';
import { DropdownComponent } from './dropdown/dropdown.component';



@NgModule({
  declarations: [
    DropdownComponent
  ],
  imports: [
    CommonModule
  ],
  providers:[
    {
      provide: SidebarService,
      useClass: SidebarService
    }
  ]
})
export class SharedModule { }
