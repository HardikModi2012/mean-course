import {Component, OnInit} from '@angular/core';
import {debounce} from 'typescript-debounce-decorator';
import {DesignService} from '../../core/services/design.service';

@Component({
  selector: 'app-track-and-trace',
  templateUrl: './track-and-trace.component.html',
  styleUrls: ['./track-and-trace.component.scss']
})
export class TrackAndTraceComponent implements OnInit {
  constructor(public ds: DesignService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.loadTrackingMap();
  }

  @debounce(300)
  loadTrackingMap() {
    const target: any = document.querySelector('#tracking-widget-div');
    target.innerHTML = '';
    const src = `https://pedigri.maxoptra.com/gt/gt-api/website-widget?p=https://pedigri.maxoptra.com/gt/&a=pedigri&l=en&w=${target?.offsetWidth}&h=${target.offsetHeight}`;
    const id = 'tracking-widget-script';
    this.ds.loadScript(src, {
      id,
      target: '#tracking-widget-div',
      loadType: 'defer'
    });
  }
}
