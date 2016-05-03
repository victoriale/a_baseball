/**
 * Created by Victoria on 4/19/2016.
 */
import {Component, OnInit, Output, Input, EventEmitter} from 'angular2/core';
import {CircleImage} from '../../../components/images/circle-image';
import {ImageData, CircleImageData} from '../../../components/images/image-data';
import {Carousel} from '../carousel.component';

/*
  index?: is
  backgroundImage?: string; // incase the carousel requires a background image for the whole carousel container will have default in place if none provided
  imageData: CircleImageData; // attached interface for the required fields needed for a functional Image for the slider. from image-data.ts please go there for documentation
  description?: Array<string>; // if there is description then will use angular2 [innerHTML] to render content.  the array can contain anything HTML related and in the slider-carousel.component.html it will loop through and display each item in the array.
*/
export interface SliderCarouselInput {
  index?:any;
  backgroundImage?: string;
  imageConfig: CircleImageData;
  description?: Array<string>;
}

@Component({
  selector: 'slider-carousel',
  templateUrl: './app/components/carousels/slider-carousel/slider-carousel.component.html',
  directives: [Carousel, CircleImage],
  providers: [],
  outputs:['indexNum'],
})

export class SliderCarousel implements OnInit {
  @Input() carouselData: Array<SliderCarouselInput>;
  @Input() backgroundImage: string;
  public indexNum: EventEmitter<any> = new EventEmitter();//interface for the output to return an index
  public dataPoint: SliderCarouselInput;

  constructor() {

  }

  response(event){
    //set the data event being emitted back from the carousel component
    this.dataPoint = event;

    //sets the index of the dataPoint of its current position in the array
    // the '?' meaning if there is data to even receive
    if(typeof this.dataPoint['index'] != 'undefined'){
      this.indexNum.next(this.dataPoint['index']);
    }
  }

  ngOnInit() {
    //on initial component view set the datapoint to the first item in the array if it exists
    if(typeof this.dataPoint != 'undefined'){
      this.dataPoint = this.carouselData[0];
      //if there is rank then initially set it when component is initially in view
      if(typeof this.dataPoint['index'] != 'undefined'){
        this.indexNum.next(this.dataPoint['index']);
      }
    }

    //incase there is no backgroundImage being return set the default background
    if(typeof this.backgroundImage == 'undefined'){
      this.backgroundImage = '/app/public/homePage_hero1.png';
    }

    //In case of errors display below
    if (typeof this.dataPoint == 'undefined') {
      var sampleImage = "./app/public/placeholder-location.jpg";
      this.dataPoint =
      {//placeholder data
        index:'1',
        imageConfig: {
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
