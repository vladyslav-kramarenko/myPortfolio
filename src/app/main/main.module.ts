import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainTitleComponent} from "./main-title/main-title.component";
import {SummaryComponent} from "./summary/summary.component";
import {SkillsComponent} from "./skills/skills.component";
import {ExperienceComponent} from "./experience/experience.component";
import {EducationComponent} from "./education/education.component";
import {ContactsComponent} from "./contacts/contacts.component";
import {PortfolioComponent} from "./portfolio/portfolio.component";
import {MainComponent} from './main.component';
import { CoursesComponent } from './courses/courses.component';
import { PublicationsComponent } from './publications/publications.component';


@NgModule({
  declarations: [
    MainTitleComponent,
    SummaryComponent,
    SkillsComponent,
    ExperienceComponent,
    EducationComponent,
    ContactsComponent,
    PortfolioComponent,
    MainComponent,
    CoursesComponent,
    PublicationsComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MainComponent,
  ]
})
export class MainModule {
}
