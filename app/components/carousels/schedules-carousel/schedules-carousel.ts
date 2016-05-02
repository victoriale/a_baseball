import {Component, Input, OnInit} from 'angular2/core';
import {CircleButton} from '../../buttons/circle/circle.button';
import {CircleImage} from '../../../components/images/circle-image';
import {CircleImageData} from '../../../components/images/image-data';

export interface CarouseInput{
  displayNext:string;
  displayTime:string;
  detail1Data:string;
  detail1Value:string;
  detail1Route?: Array<any>;
  detail2Data:string;
  detail2Value:string;
  detail2Route?: Array<any>;
  imageConfig1:CircleImageData;
  imageConfig2:CircleImageData;
}

@Component({
    selector: 'schedules-carousel',
    templateUrl: './app/components/carousels/schedules-carousel/schedules-carousel.html',
    directives: [CircleImage,CircleButton],
    providers: [],
})

export class SchedulesCarousel implements OnInit{
  @Input() carouselData:CarouseInput;

  ngOnInit(){

  }
}
