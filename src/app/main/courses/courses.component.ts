import {Component} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Course} from "../../shared/models/ICourse";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        'max-height': '1000px',
        'opacity': '1'
      })),
      state('closed', style({
        'max-height': '0px',
        'opacity': '0'
      })),
      transition('open => closed', [
        animate('0.1s', style({'max-height': '0px'})),
        animate('0.1s', style({'opacity': '0'}))
      ]),
      transition('closed => open', [
        animate('0.1s', style({'max-height': '1000px'})),
        animate('0.2s', style({'opacity': '1'}))
      ])
    ])
  ]
})
export class CoursesComponent {
  courses: Course[] = [];

  constructor(private http: HttpClient) {
  }

  toggleCollapse(course: any) {
    course.expanded = !course.expanded;
  }

  ngOnInit() {
    this.http.get<{ [key: string]: Course }>('assets/data/courses.json').subscribe(data => {
      this.courses = Object.values(data);
    });
  }
}
