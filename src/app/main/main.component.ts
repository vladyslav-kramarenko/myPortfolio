import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.scrollToFragment(fragment);
      }
    });
  }

  private scrollToFragment(fragment: string) {
    if (fragment) {
      const element = document.querySelector('#' + fragment);

      if (element) {
        element.scrollIntoView({behavior: "smooth"});
      }
    }
  }
}
