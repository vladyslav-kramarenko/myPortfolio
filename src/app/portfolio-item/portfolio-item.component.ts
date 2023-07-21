import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {PortfolioItem} from "../shared/models/IPortfolioItem";
import {Image} from '../shared/models/IImage';
import Swiper from "swiper";


@Component({
  selector: 'app-portfolio-item',
  templateUrl: './portfolio-item.component.html',
  styleUrls: ['./portfolio-item.component.scss'],

})
export class PortfolioItemComponent implements AfterViewInit,OnInit  {
  @ViewChild('mySwiper') mySwiper!: ElementRef;
  portfolioItem: PortfolioItem | undefined;
  folder = "../../../assets/"
  currentImage?: Image;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {
  }

  ngAfterViewInit() {
    new Swiper(this.mySwiper.nativeElement, {
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }

  ngOnInit() {
    const itemId = this.route.snapshot.paramMap.get('id');
    this.http.get<PortfolioItem[]>('assets/data/portfolioItems.json')
      .subscribe((data: PortfolioItem[]) => {
        this.portfolioItem = data.find(item => item.id === itemId);

        if (this.portfolioItem) {
          this.currentImage = this.portfolioItem.images[0];
        }
      });
  }

  setCurrentImage(image: Image): void {
    this.currentImage = image;
  }
}
