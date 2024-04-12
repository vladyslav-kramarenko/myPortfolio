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
  folder = '../../../assets/';

  filters = [
    {name: 'All', filter: '*'},
    {name: 'Front-End', filter: 'Front-End'},
    {name: 'Back-End', filter: 'Back-End'},
    {name: 'API', filter: 'API'},
    {name: 'Application', filter: 'Application'},
    {name: 'Design', filter: 'Design'},
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
      // this.populateFilters();
    });
  }

  /**
   * Generate filters from the available tags in portfolio items
   */
  populateFilters() {
    const allTags = new Set<string>();
    this.portfolioItems.forEach(item => item.tags.forEach(tag => allTags.add(tag)));
    this.filters = [{name: 'All', filter: '*'}, ...Array.from(allTags).map(tag => ({name: tag, filter: tag}))];
  }
}
