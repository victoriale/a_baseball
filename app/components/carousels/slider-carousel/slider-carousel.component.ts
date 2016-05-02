/**
 * Created by Victoria on 4/19/2016.
 */
import {Component, OnInit, Input} from 'angular2/core';
import {CircleImage} from '../../../components/images/circle-image';
import {ImageData, CircleImageData} from '../../../components/images/image-data';

export interface SilderCarouselInput {
  backgroundImage?: string;
  imageData: CircleImageData;
  description?: Array<string>;
}

@Component({
  selector: 'slider-carousel',
  templateUrl: './app/components/carousels/slider-carousel/slider-carousel.component.html',
  directives: [CircleImage],
  providers: [],
})

export class SliderCarousel implements OnInit {
  @Input() carouselData: SilderCarouselInput;

  constructor() {

  }

  ngOnInit() {
    //In case of errors display below
    if (typeof this.carouselData == 'undefined') {
      var sampleImage = "./app/public/placeholder-location.jpg";
      this.carouselData =
      {
        backgroundImage: '/app/public/homePage_hero1.png',
        imageData: {
          imageClass: "image-150",
          mainImage: {
            imageUrl: sampleImage,
            urlRouteArray: ['Disclaimer-page'],
            hoverText: "<p>Error</p>",
            imageClass: "border-large"
          },
          subImages: [
            {
              imageUrl: sampleImage,
              urlRouteArray: ['Disclaimer-page'],
              hoverText: "<i class='fa fa-mail-forward'></i>",
              imageClass: "image-50-sub image-round-lower-right"
            },
            {
              text: "#1",
              imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
            }
          ],
        },
        description: [
          "<p>Line1</p>",
          "<p>Line2</p>",
          "<p>Line3</p>",
          "<p>Line4</p>",
        ],
      };
    }
  }
}
