import { style, transition, trigger, animate } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-message',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [style({ opacity: 0 }),
      animate('.2s ease-out', style({
        opacity: 1
      }))]),
      transition(':leave', [animate('.2s ease-in', style({
        opacity: 0
      }))])
    ])
  ],
  template: '<div *ngIf="isVisible" @fadeIn>Here is a message</div>'
})
export class MessageComponent implements OnInit {
  @Input() isVisible = false;
  constructor() { }

  ngOnInit() {
  }

}
