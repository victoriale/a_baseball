import {Component, Input, OnInit} from 'angular2/core';
import {CircleButton} from '../../buttons/circle/circle.button';
import {CircleImage} from '../../../components/images/circle-image';
import {CircleImageData} from '../../../components/images/image-data';

export interface CarouselInput{
  displayNext:string;
  displayTime:string;
  detail1Data:string;
  detail1Value:string;
  detail2Value:string;
  detail1Route?: Array<any>;
  detail2Route?: Array<any>;
  imageConfig1:CircleImageData;
  imageConfig2:CircleImageData;
}

@Component({
    selector: 'schedules-carousel',
    templateUrl: './app/components/carousels/schedules-carousel/schedules-carousel.html',
    directives: [CircleImage,CircleButton],
    providers: [],
})

export class SchedulesCarousel implements OnInit{
  @Input() carouselData:CarouselInput;

  ngOnInit(){
    if(typeof this.carouselData == 'undefined'){
      this.carouselData = {
        displayNext:'Next Game:',
        displayTime:'[DOW] [Month] [dd], [yyyy] | [Time] [AM/PM] [Zone]',
        detail1Data:'Home Stadium:',
        detail1Value:"[Stadium's]",
        detail2Value:'[City], [State]',
        imageConfig1:{
          imageClass: "image-125",
          mainImage: {
            imageUrl: "./app/public/placeholder-location.jpg",
            urlRouteArray: ['Disclaimer-page'],
            hoverText: "<p>View</p><p>Profile</p>",
            imageClass: "border-large"
          }
        },
        imageConfig2:{
          imageClass: "image-125",
          mainImage: {
            imageUrl: "./app/public/placeholder-location.jpg",
            urlRouteArray: ['Disclaimer-page'],
            hoverText: "<p>View</p><p>Profile</p>",
            imageClass: "border-large"
          }
        },
      };
    }
  }
}
