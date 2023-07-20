import {Component} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {PortfolioItem} from '../../shared/models/IPortfolioItem';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent {
  activeFilter = '*';
  folder = '../../../assets/img/';

  filters = [
    {name: 'All', filter: '*'},
    {name: 'API', filter: 'api'},
    {name: 'Web-site', filter: 'web'},
    {name: 'Application', filter: 'app'},
    {name: 'Design', filter: 'design'},
    {name: 'Drawing', filter: 'draw'},
  ];

  constructor(private http: HttpClient) {
  }

  portfolioItems: PortfolioItem[] = [];

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  ngOnInit() {
    this.http.get<{ [key: string]: PortfolioItem }>('assets/data/portfolioItems.json').subscribe(data => {
      this.portfolioItems = Object.values(data);
    });
  }
}
