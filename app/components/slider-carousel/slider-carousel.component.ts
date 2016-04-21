/**
 * Created by Victoria on 4/19/2016.
 */
import {Component, OnInit, Input, EventEmitter} from 'angular2/core';
import {CircleButton} from "../buttons/circle/circle.button";

@Component({
    selector: 'slider-carousel',
    templateUrl: './app/components/slider-carousel/slider-carousel.component.html',
    directives: [CircleButton],
    providers: [],
})

export class SliderCarousel implements OnInit {
  left(){
    console.log('left');
  }

  right(){
    console.log('right');
  }
  ngOnInit(){

  }
}
