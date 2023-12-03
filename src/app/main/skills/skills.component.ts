import {Component} from '@angular/core';
import {SkillGroup} from "../../shared/models/ISkillGroup";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent {
  skills: SkillGroup[] = [];
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
    this.expandedState = new Array(this.skills.length).fill(false);
  }

  getIconUrl(icon: { name: string; logo: string; logoColor: string; labelColor: string } | undefined): string {
    if (icon) {
      return `https://img.shields.io/badge/-${icon.name}-${icon.logoColor}?style=flat&logo=${icon.logo}&logoColor=${icon.logoColor}&labelColor=${icon.labelColor}`;
    } else {
      return ''; // or return a default URL
    }
  }
}


