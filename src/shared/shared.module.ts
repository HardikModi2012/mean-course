import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarService } from './services/sidebar.service';
import { DropdownComponent } from './dropdown/dropdown.component';
import { VideoPlayerComponent } from './video-player/video-player.component';



@NgModule({
  declarations: [
    DropdownComponent,
    VideoPlayerComponent
  ],
  imports: [
    CommonModule,
  ],
  exports:[
    VideoPlayerComponent
  ],
  providers:[
    {
      provide: SidebarService,
      useClass: SidebarService
    }
  ]
})
export class SharedModule { }
