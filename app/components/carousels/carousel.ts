/**
 * Created by Victoria on 4/19/2016.
 */
import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import {CircleButton} from "../buttons/circle/circle.button";
import {SliderCarousel} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {SchedulesCarousel} from '../../components/carousels/schedules-carousel/schedules-carousel';

@Component({
    selector: 'carousel',
    templateUrl: './app/components/carousels/carousel.html',
    directives: [SchedulesCarousel, SliderCarousel, CircleButton],
    providers: [],
    outputs: ['scrollRight', 'scrollLeft']
})

export class Carousel implements OnInit {
  @Input() carouselData: any;
  public scrollRight: EventEmitter<boolean> = new EventEmitter();
  public scrollLeft: EventEmitter<boolean> = new EventEmitter();

  /*
    
    below are selections that the carousel will be able to accept
    as inputs for @Input() type;  by choosing one of these it will paint the correct component into the carousel

    ngOnInit will run the @Input() type; through a switch statement which will decide which component carousel to choose;
    by default it will default to type1 but have placeholder data to represent itself

    'schedule' if chosen will change the carousel to a schedule carousel which will show the appropriate datapoints for scheduling dates and comparison
    you may find these datapoints that the schedules carousel require here ./app/components/carousels/schedules-carousel/schedules-carousel

    'type1' if chosen will change the carousel to a 'slider carousel' type which is a large image, 2 sub images and 4 lines of text in rows
    you may find these datapoints that the slider carousel require here ./app/components/carousels/slider-carousel/slider-carousel.component

  */

  @Input() type: string;
  public schedule:boolean;
  public type1:boolean;
  // public type2:boolean; unused

  constructor() {

  }

  left(){
    var returnData = -1;
    console.log(returnData);
    return returnData;
  }

  right(){
    var returnData = 1;
    console.log(returnData);
    return returnData;
  }
  ngOnInit(){
    switch(this.type){
      case 'schedule':
        this.schedule = true;
      break;
      case 'type1':
        this.type1 = true;
      break;
      // case 'type2':
      //   this.type2 = true;
      // break;
      default:
        this.type1 = true;
      break;
    }
  }
}
