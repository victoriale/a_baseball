import {Component, Input, OnInit} from 'angular2/core';
import {ModuleFooter} from '../../components/module-footer/module-footer';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {SchedulesCarousel} from '../../components/carousels/schedules-carousel/schedules-carousel';

@Component({
    selector: 'schedules',
    templateUrl: './app/modules/schedules/schedules.html',
    directives: [SchedulesCarousel, ModuleHeader, ModuleFooter],
    providers: [],
    inputs:['']
})

export class SchedulesModule implements OnInit{
  carouselData:any;
  moduleTitle:string = "Module Title";

  ngOnInit(){
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
    }
    console.log(this.carouselData);
  }
}
