/**
 * Created by Victoria on 4/19/2016.
 */
import {Component, OnInit, Output, Input, EventEmitter} from 'angular2/core';
import {CircleImage} from '../../images/circle-image';
import {ImageData, CircleImageData} from '../../images/image-data';
import {Carousel} from '../carousel.component';
import {ModuleFooter, ModuleFooterData} from '../../module-footer/module-footer.component'

/*
  index?: //(optional) parameter in case it is needed to know the position of the object in its current array

  backgroundImage?: string; // incase the carousel requires a background image for the whole carousel container will have default in place if none provided

  imageData: CircleImageData; // attached interface for the required fields needed for a functional Image for the slider. from image-data.ts please go there for documentation

  description?: Array<string>; // if there is description then will use angular2 [innerHTML] to render content.  the array can contain anything HTML related and in the slider-carousel.component.html it will loop through and display each item in the array.

  footerInfo?: ModuleFooterData; // (optional) if the carousel has a footer that requires information to link to its desired profile the contents please go to module-footer.component.ts for more info
*/
export interface SliderCarouselInput {
  index?:any;
  backgroundImage?: string;
  imageConfig: CircleImageData;
  description?: Array<string>;
  footerInfo?: ModuleFooterData;
}

@Component({
  selector: 'slider-carousel',
  templateUrl: './app/components/carousels/slider-carousel/slider-carousel.component.html',
  directives: [ModuleFooter, Carousel, CircleImage],
  providers: [],
  outputs:['indexNum'],
})

export class SliderCarousel implements OnInit {
  @Input() carouselData: Array<SliderCarouselInput>;
  @Input() backgroundImage: string;
  @Input() indexInput: any;//this is an optional Input to determine where the current index is currently positioned. otherwise set the defaul indexInput to 0;
  @Input() footerStyle: any;

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

  ngOnChanges(){
    // Don't set indexInput to 0 here, it resets anything the parent specifies
    // this.indexInput = 0;
  }

  ngOnInit() {
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
