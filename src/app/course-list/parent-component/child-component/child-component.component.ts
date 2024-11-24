import { Component, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-child-component",
  templateUrl: "./child-component.component.html",
  styleUrls: ["./child-component.component.css"],
})
export class ChildComponentComponent implements OnInit {
  @Output() outPutData: any = "";
  constructor() {}

  ngOnInit() {}
}
