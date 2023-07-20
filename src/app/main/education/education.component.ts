import {Component} from '@angular/core';
import {EducationItem} from "../../shared/models/IEducationItem";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
})
export class EducationComponent {
  constructor(private http: HttpClient) {
  }

  education: EducationItem[] = [];

  ngOnInit() {
    this.http.get<{ [key: string]: EducationItem }>('assets/data/education.json').subscribe(data => {
      this.education = Object.values(data);
    });
  }
}
