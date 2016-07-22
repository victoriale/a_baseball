/**
 * Created by Victoria on 4/19/2016.
 */
import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {CircleButton} from "../buttons/circle/circle.button";

@Component({
    selector: 'carousel',
    templateUrl: './app/components/carousels/carousel.component.html',
    directives: [CircleButton],
    providers: [],
    outputs: ['scrollRight', 'scrollLeft','carouselDataPoint']
})

export class Carousel implements OnInit, OnChanges {
  @Input() carouselData: Array<any>;
  @Input() indexInput: any;//this is an optional Input to determine where the current index is currently positioned. otherwise set the defaul indexInput to 0;

  public carouselDataPoint = new EventEmitter();
  public scrollRight = new EventEmitter();
  public scrollLeft = new EventEmitter();

  public schedule:boolean;
  public counter: number = 0;
  public max: number = 0;
  // public type2:boolean; unused

  constructor() {

  }

  left(){
    var returnData = -1;//for outputing data
    var counter = this.counter;
    counter--;

    //make a check to see if the array is below 0 change the array to the top level
    if(counter < 0){
      this.counter = (this.max - 1);
    }else{
      this.counter = counter;
    }
    this.changeMain(this.counter);
    return returnData;//a returned variable for output
  }

  right(){
    var returnData = 1;
    var counter = this.counter;
    counter++;
    //check to see if the end of the obj array of images has reached the end and will go on the the next obj with new set of array
    if(counter >= this.max){
      this.counter = 0;
    }else{
      this.counter = counter;
    }
    this.changeMain(this.counter);
    return returnData;//a returned variable for output
  }

  //this is where the angular2 decides what is the main image
  changeMain(num){
    if ( num < this.carouselData.length ) {
      this.carouselDataPoint.next(this.carouselData[num]);
    }
  }

  ngOnChanges(){
    if(typeof this.indexInput == 'undefined' || this.indexInput < 0){
      this.counter = 0;
    }else{
      this.counter = this.indexInput;
    }
    this.max = this.carouselData.length;
    this.changeMain(this.counter);
    
  }


  ngOnInit() {
    if(typeof this.carouselData == 'undefined' || this.carouselData.length == 0){
      var sampleImage = "./app/public/no-image.jpg";
      this.carouselData =[
        // {
        //   backgroundImage: '/app/public/Image-Placeholder-1.jpg',
        //   imageData: {
        //     imageClass: "image-150",
        //     mainImage: {
        //       imageUrl: sampleImage,
        //       urlRouteArray: ['Disclaimer-page'],
        //       hoverText: "<p>View</p> Profile",
        //       imageClass: "border-large"
        //     },
        //     subImages: [
        //       {
        //         imageUrl: sampleImage,
        //         urlRouteArray: ['Disclaimer-page'],
        //         hoverText: "<i class='fa fa-mail-forward'></i>",
        //         imageClass: "image-50-sub image-round-lower-right"
        //       },
        //       {
        //         text: "#1",
        //         imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
        //       }
        //     ],
        //   },
        //   description: [],
        // },
        // {
        //   backgroundImage: '/app/public/Image-Placeholder-1.jpg',
        //   imageData: {
        //     imageClass: "image-150",
        //     mainImage: {
        //       imageUrl: sampleImage,
        //       urlRouteArray: ['Disclaimer-page'],
        //       hoverText: "<p>View</p> Profile",
        //       imageClass: "border-large"
        //     },
        //     subImages: [
        //       {
        //         imageUrl: sampleImage,
        //         urlRouteArray: ['Disclaimer-page'],
        //         hoverText: "<i class='fa fa-mail-forward'></i>",
        //         imageClass: "image-50-sub image-round-lower-right"
        //       },
        //       {
        //         text: "#1",
        //         imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
        //       }
        //     ],
        //   },
        //   description: [],
        // }
      ];
    }
  }
}
