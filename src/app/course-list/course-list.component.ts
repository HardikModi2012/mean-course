import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {


  gridData : BehaviorSubject<[]>
  constructor() { }

  ngOnInit() {
  }

  openClassModel(){

  }

  gridRowSelected(){
    // this.
  }

}
