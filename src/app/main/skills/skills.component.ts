import {Component} from '@angular/core';

interface SkillGroup {
  category: string;
  skills: string[];
  collapsed: boolean;
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent {
  mainSkills: string[] = ['Java', 'Spring Boot', 'Hibernate/JPA', 'SQL', 'RESTful API'];
  skills: SkillGroup[] = [
    {
      category: 'Programming skills',
      skills: ['Java','Python','JavaScript','TypeScript','Angular','SQL','XML','YAML','HTML','CSS'],
      collapsed: true
    },
    {
      category: 'Frameworks/Tools',
      skills: [
        'Bootstrap','Git','Spring Boot','Spring Security','Spring MVC','Hibernate/JPA',
        'Mockito','Swagger','Maven','Gradle','JUnit','SonarQube'
      ],
      collapsed: true
    }, {
      category: 'Methodologies',
      skills: ['Agile','Scrum','Kanban','Lean','TDD','Waterfall','TOC'],
      collapsed: true
    },
    {
      category: 'Soft skills',
      skills: [
        'Curiosity','Goal-oriented','Stress tolerance','Problem-solving',
        'Leadership','Organization','Customer-centric','Adaptability','Flexibility'
      ],
      collapsed: true
    }
  ];

  toggleCollapsed(skillGroup: SkillGroup): void {
    skillGroup.collapsed = !skillGroup.collapsed;
  }
}
