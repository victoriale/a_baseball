import {Component, Input, Output, EventEmitter, OnInit} from 'angular2/core';
import {CircleButton} from '../../buttons/circle/circle.button';
import {CircleImage} from '../../../components/images/circle-image';
import {CircleImageData} from '../../../components/images/image-data';
import {Carousel} from '../carousel.component';

export interface CarouselInput{
  index?:any;//to know the or position of the input in the array it could possibly be in
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
    templateUrl: './app/components/carousels/schedules-carousel/schedules-carousel.component.html',
    directives: [Carousel, CircleImage,CircleButton],
    providers: [],
    outputs:['indexNum'],
})

export class SchedulesCarousel implements OnInit{
  @Input() carouselData:Array<CarouselInput>;
  public indexNum: EventEmitter<any> = new EventEmitter();//interface for the output to return an index
  public dataPoint: CarouselInput;

  response(event){
    //set the data event being emitted back from the carousel component
    this.dataPoint = event;

    //sets the index of the dataPoint of its current position in the array
    // the '?' meaning if there is data to even receive
    if(typeof this.dataPoint['index'] != 'undefined'){
      this.indexNum.next(this.dataPoint['index']);
    }
  }

  ngOnInit(){
    //on initial component view set the datapoint to the first item in the array if it exists
    if(typeof this.dataPoint != 'undefined'){
      this.dataPoint = this.carouselData[0];
      //if there is rank then initially set it when component is initially in view
      if(typeof this.dataPoint['index'] != 'undefined'){
        this.indexNum.next(this.dataPoint['index']);
      }
    }

    //if nothing is returned and data is undefined then run placeholder data
    if(typeof this.dataPoint == 'undefined' || typeof this.dataPoint.imageConfig1 == 'undefined' || typeof this.dataPoint.imageConfig2 == 'undefined'){
      this.dataPoint = {//placeholder data
        index:'1',
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
      this.indexNum.next(this.dataPoint['index']);
    }
  }
}
