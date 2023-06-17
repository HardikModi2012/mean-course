import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit, AfterViewInit {
  videoPath: any = '';
  isInvalidFormat = false;
  @ViewChild('videoContainer', { static: false }) videoContainer: ElementRef<any>

  constructor() { }

  ngOnInit() {
  }


  ngAfterViewInit() {
    this.renderVideo();
  }

  renderVideo() {
    if (this.videoPath) {
      let path = '';
      if (this.videoPath) {
        path = this.videoPath.slice(this.videoPath.indexOf('.') + 1)

        if (path !== 'mp4' && path !== 'webm') {
          this.isInvalidFormat = true;
        } else {
          let elm = document.createElement('iframe') as HTMLIFrameElement;
          elm.src = '';

          elm.height = '';
          elm.width = '';
          elm.title = '';
          elm.frameBorder = '0';
          elm.allow = 'accelerometer, autoplay, clipboard-write, encrypted-media; gyroscope; picture-in-picture'
          // elm.onplayin
          elm.allowFullscreen = true;
          elm.style.paddingTop = '20px';

          this.videoContainer.nativeElement.appendChild(elm);
          elm.onload = function () {
            console.log("The elm is loaded");
          }
          elm.onerror = function () {
            console.log("Something wrong happened");
          }
        }
      }

    }

  }
}
