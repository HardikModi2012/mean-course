import { Component, OnInit, HostBinding } from "@angular/core";
import { SidebarService } from "src/shared/services/sidebar.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  isMaxSideBar: boolean = false;

  constructor(public sideNavService: SidebarService) {}

  @HostBinding("class.is-expanded")
  get isExpanded(): boolean {
    return this.sideNavService.isExpanded;
  }

  ngOnInit() {}

  toggleSidebar() {
    this.isMaxSideBar = !this.isMaxSideBar;
  }
}
