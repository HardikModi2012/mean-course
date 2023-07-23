import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-docket',
  templateUrl: './docket.component.html',
  styleUrls: ['./docket.component.css'],
  animations: [
    trigger('rotatedState', [
      state('0', style({ transform: 'rotate(0)' })),
      state('90', style({
        transform: 'rotate(90deg)',
        width: '80vh'
      })),
      state('180', style({ transform: 'rotate(180deg)' })),
      state('270', style({
        transform: 'rotate(270deg)',
        width: '80vh'
      })),
      transition('0 => 90', animate('400ms ease-out')),
      transition('90 => 180', animate('400ms ease-out')),
      transition('180 => 270', animate('400ms ease-out')),
      transition('270 => 0', animate('400ms ease-out')),
    ])]
})
export class DocketComponent implements OnInit {
  state = '0';
  constructor(
    // private dialogRef: MatDialogRef<DocketComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // dialogRef.addPanelClass('docket-image-dialog')
  }

  ngOnInit() {
  }


  rotate() {
    this.state = (+this.state + 90).toString();
    if (this.state === '360') {
      this.state = '0';
    }
  }

}

