/**
 * Created by Victoria on 4/19/2016.
 */
import {Component, OnInit, Input, EventEmitter} from 'angular2/core';
import {CircleButton} from "../buttons/circle/circle.button";
import {CircleImage} from '../../components/images/circle-image';
import {ImageData,CircleImageData} from '../../components/images/image-data';
export interface TestImage {
  imageData: CircleImageData;
  description: string;
}

@Component({
    selector: 'slider-carousel',
    templateUrl: './app/components/slider-carousel/slider-carousel.component.html',
    directives: [CircleButton, CircleImage],
    providers: [],
})

export class SliderCarousel implements OnInit {

  public teamRosterImg: Array<TestImage>;

  constructor() {
    this.getData();
  }
  getData(){
    var sampleImage = "./app/public/placeholder-location.jpg";
    this.teamRosterImg =[
      {
        description: "",
        imageData: {
          imageClass: "image-150",
          mainImage: {
            imageUrl: sampleImage,
            urlRouteArray: ['Disclaimer-page'],
            hoverText: "<p>View</p> Profile",
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
        }
      }];
  }
  left(){
    console.log('left');
  }

  right(){
    console.log('right');
  }
  ngOnInit(){

  }
}
