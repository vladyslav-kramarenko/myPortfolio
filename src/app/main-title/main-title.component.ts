import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Typed from 'typed.js';

@Component({
  selector: 'app-main-title',
  templateUrl: './main-title.component.html',
  styleUrls: ['./main-title.component.scss']
})
export class MainTitleComponent implements OnInit {
  @ViewChild('typed', { static: true }) typed!: ElementRef;

  ngOnInit() {
    const options = {
      strings: this.typed.nativeElement.getAttribute('data-typed-items').split(','),
      typeSpeed: 150,
      backSpeed: 40,
      loop: true,
      backDelay: 2500
    };
    new Typed(this.typed.nativeElement, options);
  }
}
