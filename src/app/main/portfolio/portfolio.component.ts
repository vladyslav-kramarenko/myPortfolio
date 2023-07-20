import { Component } from "@angular/core";

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent {
  activeFilter = '*';
  folder='../../../assets/img/';

  filters = [
    { name: 'All', filter: '*' },
    { name: 'API', filter: 'api' },
    { name: 'Web-site', filter: 'web' },
    { name: 'Application', filter: 'app' },
    { name: 'Design', filter: 'design' },
    { name: 'Drawing', filter: 'draw' },
  ];

  portfolioItems = [
    {
      id: 'moviesApi',
      filter: 'api',
      links: [
        {
          url: 'https://github.com/vladyslav-kramarenko/moviesApi',
          title: 'Api with CRUD operations for movie database'
        }
      ],
      img: 'portfolio/moviesApi.webp',
      alt: 'Movies API'
    },
    {
      id: 'Gift-Certificates-system',
      filter: 'api',
      links: [
        {
          url: 'https://github.com/vladyslav-kramarenko/GiftCertificatesSystem',
          title: 'Gift Certificates System API'
        }
      ],
      img: 'portfolio/GiftCertificatesSystemApi.webp',
      alt: 'Gift Certificates System API'
    },
    {
      id: 'Just-Cat-Package',
      filter: 'design',
      links: [
        {
          url: 'justCatPackage.html',
          title: 'Just Cat Package Design'
        }
      ],
      img: 'portfolio/preview/Just_cat_3-min.webp',
      alt: 'JustCat Package'
    },
    {
      id: 'Just-Cat-Logo',
      filter: 'design',
      links: [
        {
          url: 'https://justcat.com.ua/',
          title: 'Just Cat Logo'
        }
      ],
      img: 'logo/JustCatLogo.webp',
      alt: 'JustCat Logo'
    },
    {
      id: 'scratching-post',
      filter: 'draw',
      links: [
        {
          url: 'portfolio/scratching_post.skp',
          title: 'Scratching Post'
        }
      ],
      img: 'portfolio/preview/scratching_post-min.webp',
      alt: 'Scratching Post'
    },
    {
      id: 'roller-for-granulator',
      filter: 'draw',
      links: [
        {
          url: 'portfolio/roller_for_granulator_400.skp',
          title: 'Rollers for pellet granulator'
        }
      ],
      img: 'portfolio/preview/roller_for_granulator_400-min.webp',
      alt: 'Rollers for pellet granulator'
    },
    {
      id: 'Tic-Tac-Toe-figma',
      filter: 'design',
      links: [
        {
          url: 'https://www.figma.com/file/B1GrymQ9gnxy9pNkSYOQHu/Tic-Tac-Toe?node-id=0%3A1',
          title: 'Tic-Tac-Toe design with Figma'
        }
      ],
      img: 'portfolio/preview/tic-tac-toe_web_design.webp',
      alt: 'Tic-Tac-Toe'
    },
    {
      id: 'tax-service',
      filter: 'web',
      links: [
        {
          url: 'tax_service.html',
          title: 'Tax Service'
        }
      ],
      img: 'portfolio/tax_service/tax_service_reports.webp',
      alt: 'Tax Service'
    },
    {
      id: 'lagrange',
      filter: 'web',
      links: [
        {
          url: 'http://lagrange.kramarenko.info/',
          title: 'Online function interpolation using Lagrange method'
        }
      ],
      img: 'portfolio/lagrange.webp',
      alt: 'Lagrange'
    },
    {
      id: 'tic-tac-toe',
      filter: 'web',
      links: [
        {
          url: 'http://tic-tac-toe.kramarenko.info/',
          title: 'Tic-Tac-Toe'
        }
      ],
      description:'',
      img: 'portfolio/tic-tac-toe_web.webp',
      alt: 'Tic-Tac-Toe'
    },
    {
      id: 'cmvi',
      filter: 'app',
      links: [
        {
          url: 'https://github.com/vladyslav-kramarenko/CMVI',
          title: 'App for solving mathematical problems by numerical methods'
        }
      ],
      img: 'portfolio/cmvi.webp',
      alt: 'java app'
    }
  ];


  setFilter(filter: string) {
    this.activeFilter = filter;
  }
}
