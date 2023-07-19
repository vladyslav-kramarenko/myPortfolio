import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainTitleComponent } from './main-title/main-title.component';
import { SummaryComponent } from './summary/summary.component';
import { SkillsComponent } from './skills/skills.component';
import { ExperienceComponent } from './experience/experience.component';
import { EducationComponent } from './education/education.component';
import { ContactsComponent } from './contacts/contacts.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: MainTitleComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'skills', component: SkillsComponent },
  { path: 'experience', component: ExperienceComponent },
  { path: 'education', component: EducationComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'portfolio', component: PortfolioComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
