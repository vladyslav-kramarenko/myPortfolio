import {Component} from '@angular/core';
import {animate, group, state, style, transition, trigger} from "@angular/animations";
import {ExperienceItem} from "../../shared/models/IExperienceItem";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
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
        group([
          animate('0.5s', style({'max-height': '0px'})),
          animate('0.3s', style({'opacity': '0'}))
        ])
      ]),
      transition('closed => open', [
        group([
          animate('0.2s', style({'max-height': '1000px'})),
          animate('0.5s', style({'opacity': '1'}))
        ])
      ]),
    ]),
  ]

})
export class ExperienceComponent {

  constructor(private http: HttpClient) {
    this.expandedState = [];
  }

  logoFolder: string = 'assets/img/logo/';
  expandedState: boolean[];
  experiences: ExperienceItem[] = [];

  ngOnInit() {
    this.http.get<{ [key: string]: ExperienceItem }>('assets/data/experience.json').subscribe(data => {
      this.experiences = Object.values(data);
    });
    // initialize the expandedState array based on the length of experiences
    this.expandedState = new Array(this.experiences.length).fill(false);
  }

  toggleCollapse(index: number) {
    this.expandedState[index] = !this.expandedState[index];
  }
}
