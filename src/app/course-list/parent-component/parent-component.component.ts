import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-parent-component",
  templateUrl: "./parent-component.component.html",
  styleUrls: ["./parent-component.component.css"],
})
export class ParentComponentComponent implements OnInit {
  @Input() getData: any = "";
  constructor() {}

  ngOnInit() {}
}
