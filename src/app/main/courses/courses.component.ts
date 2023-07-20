import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
        animate('0.1s', style({ 'max-height': '0px' })),
        animate('0.1s', style({ 'opacity': '0' }))
      ]),
      transition('closed => open', [
        animate('0.1s', style({ 'max-height': '1000px' })),
        animate('0.2s', style({ 'opacity': '1' }))
      ])
    ])
  ]
})
export class CoursesComponent {
  courses = [
    {
      title: 'EPAM SOFTWARE',
      expanded: false,
      details: [
        {
          link: '',
          description: 'EPAM AWS Cloud Practitioner Essentials (February 2023 - March 2023)'
        },
        {
          link: 'https://certificates.epam.com/certificates/ffbe8999-875d-48f6-b8cc-6b62e4575c25',
          description: 'IT Marathon (November 2022 - December 2022)'
        },
        {
          link: 'https://certificates.epam.com/certificates/121ef58b-c16f-4eb1-816f-aa715cbec7d0',
          description: 'Java Spring-Summer 2022 (June 2022 - December 2022)\n- Enhanced proficiency in full-stack Java development, including servlets, adeptly managed databases, and effectively worked with XML data using foundational skills in Java, HTML, CSS, JavaScript, SQL, and MySQL.'
        }
      ]
    },
    {
      title: 'AWS',
      expanded: false,
      details: [
        {
          link: 'https://www.credly.com/badges/40c7c3b1-c7e5-407d-b433-6bc60dc13f6a/linked_in_profile',
          description: 'AWS Cloud Quest: Cloud Practitioner (March 2023)'
        },
        {
          link: 'img/certificates/AWS_Cloud_Practitioner_Essentials.pdf',
          description: 'AWS Cloud Practitioner Essentials (February 2023)'
        }
      ]
    },
    {
      title: 'Salesforce',
      expanded: false,
      details: [
        {
          link: 'https://trailblazer.me/id/kramarenko',
          description: 'Trailhead (December 2022 - Current)'
        }
      ]
    },
    {
      title: 'Linkedin',
      expanded: false,
      details: [
        {
          link: 'https://www.linkedin.com/learning/certificates/568732c50d7962949f378f6099a8a19a73e20ed4c1647b178c3d15f2a2d14c03?u=106534538',
          description: 'Learning Kubernetes'
        },
        {
          link: 'https://www.linkedin.com/learning/certificates/e5fb7094be88fc97b0541d32694170431c88b3ddaf74acf14c4df09c505754d5?u=106534538',
          description: 'Agile: Foundations'
        },
        {
          link: 'https://www.linkedin.com/learning/certificates/d6a7cfb2e9d325c602b0ceaea1dac1517b81b301a4bd6c04d30bd7e541c03d8f?u=106534538',
          description: 'Project Management with Jira Cloud'
        },
        {
          link: 'https://www.linkedin.com/learning/certificates/a40023cbe8209bcb7e996e5d158d3ca3926eaad0fb233de4964b8fd3e929d5a2?u=106534538',
          description: 'Java: Lambdas and Streams'
        },
        {
          link: 'https://www.linkedin.com/learning/certificates/7c3237541443b61e5f3d27ed5b7c90d7ab8b21d0be3752797736802caf2c0917?u=106534538',
          description: 'Scrum: The Basics'
        },
        {
          link: 'https://www.linkedin.com/learning/certificates/464afd16985d72625a5652d0ae8b1ce601853e99b3dbe113d320137183c6ba23?u=106534538',
          description: 'Scrum: Advanced'
        },
        {
          link: 'https://www.linkedin.com/learning/certificates/b29b23ca4cdd2f9447d935466bc5101e5439d1e3cbb8bfa8de012f87df4010f8?u=106534538',
          description: 'Building RESTful APIs with Flask'
        },
        {
          link: 'https://www.linkedin.com/learning/certificates/0c367ec16f1b6ed2ee46e65b3e831e6c1f43d8087927706d1c1eb332fb23ee9b',
          description: 'Python Essential Training'
        },
        {
          link: 'https://www.linkedin.com/learning/certificates/b67967cac042d7af5dd4e5fb27ab34dfac6b6040bd5a82dc0096f03968934b16?u=106534538',
          description: 'Advanced Design Patterns: Design Principles'
        },
        {
          link: 'https://www.linkedin.com/learning/certificates/da87b09b3d9528dcb59f006328c0bd1a32b9f647b6a593f4ce79f9acd6a112cd?u=106534538',
          description: 'Programming Foundations: Design Patterns'
        },
        {
          link: 'https://www.linkedin.com/learning/certificates/9a0f3c45cf51ea96d98514a96a63b2a2df68e8809460d161f63d2ea36b71cd8c?u=106534538',
          description: 'Object-Oriented Design'
        }
      ]
    },
    {
      title: 'Stepik',
      expanded: false,
      details: [
        {
          link: 'https://stepik.org/cert/1808213',
          description: 'Java. Functional Programming (November 2022)'
        },
        {
          link: 'https://stepik.org/cert/1508188',
          description: 'BeeGeek "Generation Python": advanced course (May 2022)'
        },
        {
          link: 'https://stepik.org/cert/1428132',
          description: 'Python: basics and application (March 2022)'
        }
      ]
    }
  ];

  toggleCollapse(course: any) {
    course.expanded = !course.expanded;
  }
}
