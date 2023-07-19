import {Component} from '@angular/core';
import {animate, group, state, style, transition, trigger} from "@angular/animations";

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
          animate('1.5s', style({'max-height': '0px'})),
          animate('0.5s', style({'opacity': '0'}))
        ])
      ]),
      transition('closed => open', [
        group([
          animate('1.5s', style({'max-height': '1000px'})),
          animate('0.5s', style({'opacity': '1'}))
        ])
      ]),
    ]),
  ]

})
export class ExperienceComponent {
  logoFolder: string = 'assets/img/logo/';
  expandedIndex = 0;

  experiences = [
    {
      role: 'External Java Lab Intern',
      company: 'EPAM SOFTWARE',
      link: 'https://www.epam.com/',
      image: `epam_logo.webp`,
      imageAlt: 'EPAM_logo',
      location: 'Ukraine, remote',
      dates: ['February 2023', 'Present'],
      description: [
        'Gained hands-on experience in Spring Boot, Spring Security, and Spring MVC frameworks.',
        'Developed a solid understanding of working with SQL and NoSQL databases and utilizing JPA/Hibernate for data management. Implemented RESTful APIs and utilized services like Auth0 for secure authentication.',
        'Gained proficiency in working with AWS services (S3, EC2, Lambda, RDS, DynamoDB) to optimize the scalability, reliability, and performance of web applications.'
      ]
    },
    {
      role: 'Head of IT Department',
      company: 'ZHYTLOBUD-2 ALC',
      link: 'https://www.zhilstroj-2.ua/',
      image: `jb2.webp`,
      imageAlt: 'JB2_logo',
      location: 'Kharkiv, Ukraine',
      dates: ['December 2020', 'Present'],
      description: [
        'Managed a diverse team of six IT professionals and various contractors, overseeing the development and management of various websites using PHP, WordPress, and JavaScript across a city-wide organization',
        'Implemented an access control system with face recognition and the ability to detect absenteeism',
        'Formed a subdivision for the creation of IT infrastructure at construction sites.',
        'Automated document flow for the transport department by integrating the "1C" accounting system with concrete node softwareб GPS vehicle monitoring, and car weights, improving operational efficiency, data accuracy and reducing the data entry period from a month to 1 day.',
        'Integrated the G-Plus CRM System across two countries and company websites, centralizing data management, and incorporating telephony systems, demonstrating proficiency in large-scale system integration.'
      ]
    },
    {
      role: 'Project Manager',
      company: 'ZHYTLOBUD-2 ALC',
      link: 'https://www.zhilstroj-2.ua/',
      image: `jb2.webp`,
      imageAlt: 'JB2_logo',
      location: 'Kharkiv, Ukraine',
      dates: ['November 2018', 'December 2020'],
      description: [
        'Ensured the implementation of the "1C" accounting system at a full-cycle construction company with more than 1000 employees.',
        'Led meetings between the company\'s departments and contractors. Gathered requirements.',
        'Conducted training sessions and provided ongoing support to employees to ensure the successful adoption of the new system',
        'Transformed lead generation by spearheading Android and iOS catalog app development with interactive apartment designs, effectively expanding the company\'s reach to web-based leads in addition to phone and office-based leads.',
        'Created Java program for daily mixer route planning, streamlining processes and boosting department efficiency'
      ]
    },
    {
      role: 'CEO / Founder',
      company: 'Just Cat',
      link: 'https://justcat.com.ua/',
      image: `JustCatLogo.webp`,
      imageAlt: 'JustCat_logo',
      location: 'Kharkiv, Ukraine',
      dates: ['August 2017', 'December 2022'],
      description: [
        'Achieved sustainable turnover growth by focusing on cost control, process improvement, and market analysis.',
        'Increased profits by 50% by dividing the manufactured product into different markets using different packaging',
        'Organized efficient delivery of orders, improving customer satisfaction and strengthening the company\'s reputation in the city',
        'Managed the financial and economic activities of the company, ensuring sustainable growth and profitability',
        'Created marketing materials and provided product advertising using Adobe Photoshop',
        'Developed strong skills in customer satisfaction'
      ]
    },
    {
      role: 'CEO / Co-Founder',
      company: 'ECOFUELTRADE LLC',
      link: 'https://youcontrol.com.ua/en/catalog/company_details/39853672/',
      image: `ecofueltrade_logo.webp`,
      imageAlt: 'EcoFuelTrade_logo',
      location: 'Kharkiv, Ukraine',
      dates: ['September 2015', 'September 2017'],
      description: [
        'Created in 2 years a new biofuel manufacturer from scratch that produced up to 100 tons of pellets/month.',
        'Managed the financial and economic activities of the company, ensuring profitability and sustainable growth',
        'Developed skills in market analysis, process improvement and risk management'
      ]
    },
    {
      role: 'Java Software developer',
      company: 'FREELANCE',
      link: '',
      image: `freelancer_logo.png`,
      imageAlt: 'EcoFuelTrade_logo',
      location: 'Kharkiv, Ukraine',
      dates: ['September 2011', 'August 2012'],
      description: [
        'Developed a website for playing radio-controlled cars with video, using a console Java application for Arduino',
        'Gained experience working with Spring and jQuery'
      ]
    }
  ];

  // toggleCollapse(index: number) {
  //   this.expandedIndex = this.expandedIndex === index ? -1 : index;
  // }

  toggleCollapse(index: number) {
      this.expandedIndex = index;
  }
}
