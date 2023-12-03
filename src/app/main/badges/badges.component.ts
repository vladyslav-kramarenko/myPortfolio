import {Component} from '@angular/core';
import {Badge} from "../../shared/models/IBadge";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss']
})

export class BadgesComponent {
  constructor(private http: HttpClient) {
  }

  badges: Badge[] = [];
  badgeFolder: string = 'assets/img/badges/';

  ngOnInit() {
    this.http.get<{ [key: string]: Badge }>('assets/data/badges.json').subscribe(data => {
      this.badges = Object.values(data);
    });
  }
}
