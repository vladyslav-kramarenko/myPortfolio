import { Component } from '@angular/core';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss']
})
export class PublicationsComponent {
  publications: any[] = [
    {
      title: 'The Journal “Innovative technologies and scientific solutions for industries',
      link: 'http://journals.uran.ua/itssi/article/view/242913',
      description: 'MODELING OF INFORMATION TECHNOLOGY OF MATERIAL RESOURCES MANAGEMENT OF A CONSTRUCTION COMPANY'
    },
    {
      title: 'Scientific and technical collection "Municipal economy of cities"',
      link: 'https://khg.kname.edu.ua/index.php/khg/article/view/5812',
      description: 'MODELING THE EXTERNAL ENVIRONMENT DYNAMICS OF REAL ESTATE PROJECT'
    },
    {
      title: 'INTERNATIONAL SCIENTIFIC AND PRACTICAL CONFERENCE INTELLIGENT INFORMATION SYSTEMS IN MARTIAL LAW PROJECT MANAGEMENT AND ECONOMICS',
      link: 'chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://www.mmp-conf.org/documents/archive/proceedings2021.pdf',
      description: 'MODELING OF HOUSING CONSTRUCTION PROJECT EXOGENEOUS FACTORS INFLUENCE ON PROJECT EFFICIENCY'
    }
  ];
}
