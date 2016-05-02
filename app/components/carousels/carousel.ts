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
  @Input() carouselData: Array<any>;
  public carouselDataPoint: any;

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
  public counter: number = 0;
  public max: number = 0;
  // public type2:boolean; unused

  constructor() {

  }

  left(){
    var returnData = -1;//for outputing data
    console.log(returnData);
    var counter = this.counter;
    counter--;

    //make a check to see if the array is below 0 change the array to the top level
    if(counter < 0){
      this.counter = this.max;
    }else{
      this.counter = counter;
    }
    console.log(this.counter);
    this.changeMain(this.counter);
    return returnData;//a returned variable for output
  }

  right(){
    var returnData = 1;
    console.log(returnData);
    var counter = this.counter;
    counter++;
    //check to see if the end of the obj array of images has reached the end and will go on the the next obj with new set of array
    if(counter == this.max){
      this.counter = 0;
    }else{
      this.counter = counter;
    }
    console.log(this.counter);
    this.changeMain(this.counter);
    return returnData;//a returned variable for output
  }


  //this is where the angular2 decides what is the main image
  changeMain(num){
    this.carouselDataPoint = this.carouselData[num];
  }

  ngOnChanges(){

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

    if(typeof this.carouselData == 'undefined'){
      var sampleImage = "./app/public/placeholder-location.jpg";
      this.carouselData =[
        {
          backgroundImage: '/app/public/homePage_hero1.png',
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
          },
          description: [
            "<p>Line1</p>",
            "<p>Line2 of random lots of random stuff here</p>",
            "<p>Zombie ipsum brains reversus ab cerebellum viral inferno, brein nam rick mend grimes malum cerveau cerebro.</p>",
            "<p>Line4</p>",
          ],
        },
        {
          backgroundImage: '/app/public/homePage_hero1.png',
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
          },
          description: [
            "<p>Brein nam rick mend grimes malum cerveau cerebro.</p>",
            "<p>Line523 of random lots of random stuff here</p>",
            "<p>Line6sdfd</p>",
            "<p>Zombie ipsum brains reversus ab cerebellum viral inferno, brein nam rick mend grimes malum cerveau cerebro.</p>",
          ],
        }
      ];
    }

    this.max = this.carouselData.length;
    this.changeMain(this.counter);
  }
}
