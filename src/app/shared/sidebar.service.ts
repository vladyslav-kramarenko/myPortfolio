import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidenavStateSubject = new BehaviorSubject<boolean>(false);
  sidenavState$ = this.sidenavStateSubject.asObservable();

  toggleSidenavState() {
    this.sidenavStateSubject.next(!this.sidenavStateSubject.value);
  }

  closeSidenav() {
    this.sidenavStateSubject.next(false);
  }
}
