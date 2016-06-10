/**
 * Created by Victoria on 4/19/2016.
 */
import {Component, OnInit, Output, Input, EventEmitter} from 'angular2/core';
import {CircleImage} from '../../images/circle-image';
import {ImageData, CircleImageData} from '../../images/image-data';
import {Carousel} from '../carousel.component';
import {ModuleFooter, ModuleFooterData} from '../../module-footer/module-footer.component'
import {ROUTER_DIRECTIVES, RouterLink} from 'angular2/router';

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
  directives: [ModuleFooter, Carousel, CircleImage, ROUTER_DIRECTIVES],
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
    if ( this.dataPoint.backgroundImage ) {
      this.backgroundImage = this.dataPoint.backgroundImage;
    }
    else {
      //var randomIndex = Math.random() > .5 ? 1 : 2;
      this.backgroundImage = '/app/public/Image-Placeholder-2.jpg';
    }
    //sets the index of the dataPoint of its current position in the array
    // the '?' meaning if there is data to even receive
    if(typeof this.dataPoint['index'] != 'undefined'){
      this.indexNum.next(this.dataPoint.index);
    }
  }

  ngOnChanges(){
    // Don't set indexInput to 0 here, it resets anything the parent specifies
    // this.indexInput = 0;
  }

  ngOnInit() {
    //incase there is no backgroundImage being return set the default background
    if(typeof this.backgroundImage == 'undefined'){
      this.backgroundImage = '/app/public/Image-Placeholder-1.jpg';
    }

    //In case of errors display below
    if (typeof this.dataPoint == 'undefined') {
      var sampleImage = "./app/public/no-image.png";
      this.dataPoint =
      {//placeholder data
        index:'1',
        imageConfig: {
          imageClass: "image-150",
          mainImage: {
            imageUrl: sampleImage,
            imageClass: "border-large"
          },
          subImages: [
            {
              imageUrl: sampleImage,
              imageClass: "image-50-sub image-round-lower-right"
            }
          ],
        },
        description: [
          "<p></p>",
          "<p></p>",
          "<p></p>",
          "<p></p>",
        ],
      };
    }
  }
}
