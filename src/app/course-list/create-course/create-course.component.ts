import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css']
})
export class CreateCourseComponent implements OnInit {
  powers = ['Really Smart', 'Super Flexible',
  'Super Hot', 'Weather Changer'];

  // to generate random string
  // const randomString = () => Math.random().toString(36).slice(2)
  // escape HTML special characters
  // const escape = (str) => str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]))
  // escape('<div class="medium">Hi Medium.</div>')

  // to uppercase first character of each word in string
  // const uppercaseWords = (str) => str.replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase())

  // convert string to camelCase
  // const toCamelCase = (str) => str.trim().replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));


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
