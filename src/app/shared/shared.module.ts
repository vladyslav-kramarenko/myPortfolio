import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidebarComponent} from "./sidebar/sidebar.component";
import {FooterComponent} from "./footer/footer.component";
import {SidebarService} from "./sidebar.service";
import {RouterLink, RouterLinkActive} from "@angular/router";


@NgModule({
  declarations: [
    SidebarComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  exports: [
    SidebarComponent,
    FooterComponent,
  ],
  providers: [SidebarService]
})
export class SharedModule {
}
