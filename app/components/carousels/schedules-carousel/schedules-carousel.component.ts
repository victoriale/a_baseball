import {Component, Input, Output, EventEmitter, OnChanges} from 'angular2/core';
import {CircleButton} from '../../buttons/circle/circle.button';
import {CircleImage} from '../../images/circle-image';
import {CircleImageData} from '../../images/image-data';
import {Carousel} from '../carousel.component';

export interface SchedulesCarouselInput{
  backgroundGradient:string;
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
  teamName1: string;
  teamName2: string;
  teamLocation1:string;
  teamLocation2:string;
  teamRecord1:string;
  teamRecord2:string;
}

@Component({
    selector: 'schedules-carousel',
    templateUrl: './app/components/carousels/schedules-carousel/schedules-carousel.component.html',
    directives: [Carousel, CircleImage,CircleButton],
    providers: [],
    outputs:['indexNum'],
})

export class SchedulesCarousel implements OnChanges{
  @Input() carouselData:Array<SchedulesCarouselInput>;
  public indexNum: EventEmitter<any> = new EventEmitter();//interface for the output to return an index
  public dataPoint: SchedulesCarouselInput;
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
    //on initial component view set the datapoint to the first item in the array if it exists
    this.dataPoint = this.carouselData[0];
    //if there is rank then initially set it when component is initially in view
    if(typeof this.dataPoint['index'] != 'undefined'){
      this.indexNum.next(this.dataPoint['index']);
    }
  }
}
