import {Component, OnInit, Input, EventEmitter} from 'angular2/core';
import {CircleButton} from "../../buttons/circle/circle.button";
import {CircleImage} from '../../images/circle-image';
import {ViewEncapsulation} from "angular2/core";
import {ROUTER_DIRECTIVES} from "angular2/router";

@Component({
    selector: 'dynamic-carousel',
    templateUrl: './app/components/carousel/dynamic-carousel/dynamic-carousel.html',
    
    directives: [CircleButton, CircleImage, ROUTER_DIRECTIVES],
    providers: [],
    inputs: ['carouselData','partnerID'],
    encapsulation: ViewEncapsulation.None
})

export class DynamicCarousel implements OnInit{
  carouselData: any;
  imageCounter: number = 0;
  data: any;
  callToAction: string = "Want more detailed information?";
  cssStyle: string = "";
  hasIndex: boolean = true;
  curRoute: any;
  partnerIdExists: boolean = false;
  partnerID: any;
  isMyHouseKit: any;

  ngOnInit(){
  }

  newCarousel(index){
    this.data = this.carouselData[index];
  }

  left(){
    //make a check to see if the obj array is below 0 change the obj array to the top level
    if(this.imageCounter == 0){
      //makes sure to change to new obj before checking the length to know what position the array should be starting at
      this.imageCounter = (this.carouselData.length - 1);
    }else{
      this.imageCounter--;
    }
    //run the changeMain function to change the main image once a new array has been established
    this.newCarousel(this.imageCounter);
  }

  right(){
    //check to see if the end of the obj array of images has reached the end and will go on the the next obj with new set of array
    if(this.imageCounter == (this.carouselData.length - 1)){
      this.imageCounter = 0;
      //if the obj array is at the end then restart by setting the object counter back to 0
    }else{
      this.imageCounter++;
    }
    //run the changeMain function to change the main image once a new array has been established
    this.newCarousel(this.imageCounter);
  }
  //makes sure to show first image and run the modifyMedia function once data has been established
  ngOnChanges(){
    if(typeof this.carouselData != 'undefined'){
      //if data coming from module to variable mediaImages changes in what way then reset to first image and rerun function
      this.data = this.carouselData[0];
      this.newCarousel(0);
    }
  }
}
