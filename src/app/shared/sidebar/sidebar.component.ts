import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {SidebarService} from "../sidebar.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @Output() linkClicked = new EventEmitter<void>();


  constructor(
    private sidebarService: SidebarService) {
  }

  closeSidenav() {
    // this.sidebarService.closeSidenav();
    this.sidebarService.toggleSidenavState();
  }
}
