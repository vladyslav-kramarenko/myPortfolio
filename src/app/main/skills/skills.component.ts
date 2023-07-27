import {Component} from '@angular/core';
import {animate, group, state, style, transition, trigger} from "@angular/animations";
import {SkillGroup} from "../../shared/models/ISkillGroup";
import {HttpClient} from "@angular/common/http";
import {Badge} from "../../shared/models/IBadge";

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
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
export class SkillsComponent {
  skills: SkillGroup[] = [];
  badges: Badge[] = [];
  badgeFolder: string = 'assets/img/badges/';
  expandedState: boolean[];

  constructor(private http: HttpClient) {
    this.expandedState = [];
  }

  toggleCollapse(index: number) {
    this.expandedState[index] = !this.expandedState[index];
  }

  ngOnInit() {
    this.http.get<{ [key: string]: SkillGroup }>('assets/data/skills.json').subscribe(data => {
      this.skills = Object.values(data);
    });
    this.http.get<{ [key: string]: Badge }>('assets/data/badges.json').subscribe(data => {
      this.badges = Object.values(data);
    });
    // initialize the expandedState array based on the length of experiences
    this.expandedState = new Array(this.skills.length).fill(false);
  }
}
