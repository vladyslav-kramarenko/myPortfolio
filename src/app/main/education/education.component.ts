import {Component} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          'max-height': '1000px',
          'opacity': '1'
        })
      ),
      state(
        'closed',
        style({
          'max-height': '0px',
          'opacity': '0'
        })
      ),
      transition('open => closed', [
        animate('0.5s', style({'max-height': '0px'})),
        animate('0.3s', style({'opacity': '0'}))
      ]),
      transition('closed => open', [
        animate('0.2s', style({'max-height': '1000px'})),
        animate('0.5s', style({'opacity': '1'}))
      ])
    ])
  ]
})
export class EducationComponent {
  expandedState: boolean[];

  constructor() {
    this.expandedState = [];
  }

  education = [
    {
      degree: 'PhD of Computer Science',
      degreeLink: '',
      university: 'O.M. Beketov National University of Urban Economy in Kharkiv',
      location: 'Kharkiv, Ukraine',
      dates: 'October 2020 - Current',
      description: []
    },
    {
      degree: 'Master of Project Management',
      degreeLink: '../../../assets/img/certificates/masters_diploma.jpg',
      university: 'National Technical University "Kharkiv Polytechnic Institute"',
      location: 'Kharkiv, Ukraine',
      dates: 'September 2013 - June 2015',
      description: [
        'Implemented a Java-based forecasting software for modeling and predicting scientific and technological development in Ukraine\'s industry, using simulation models and inter-sectoral interactions.'
      ]
    },
    {
      degree: 'Bachelor of Computer Science',
      degreeLink: '../../../assets/img/certificates/bachelor_diploma.pdf',
      university: 'National Technical University "Kharkiv Polytechnic Institute"',
      location: 'Kharkiv, Ukraine',
      dates: 'September 2009 - June 2013',
      description: []
    }
  ];

  ngOnInit() {
    // initialize the expandedState array based on the length of education
    this.expandedState = new Array(this.education.length).fill(false);
  }

  toggleCollapse(index: number) {
    this.expandedState[index] = !this.expandedState[index];
  }
}
