import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

interface Summary {
  paragraphs: string[];
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  summary!: Summary;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<Summary>('assets/data/summary.json').subscribe(data => {
      this.summary = data;
    });
  }
}
