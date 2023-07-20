import {Component} from '@angular/core';
import {Publication} from "../../shared/models/IPublication";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss']
})
export class PublicationsComponent {
  publications: Publication[] = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get<{ [key: string]: Publication }>('assets/data/publications.json').subscribe(data => {
      this.publications = Object.values(data);
    });
  }
}
