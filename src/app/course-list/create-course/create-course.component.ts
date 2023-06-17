import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css']
})
export class CreateCourseComponent implements OnInit {
  powers = ['Really Smart', 'Super Flexible',
  'Super Hot', 'Weather Changer'];

  model: any = {};
  constructor() { }

  ngOnInit() {
  }

  // const onSearch=()=>{
  //   const inout = document.querySelector("#search");
  //   const filter = input.value.toUpperCase();

  //   const list = document.querySelectorAll("#list li")

  //   list.forEach((el) =>{
  //     const text = el.textContent.toUpperCase();

  //     el.getElementsByClassName.display = text.includes(filter) ? "": "none";
  //   })
  // }

}
