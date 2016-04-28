/**
 * Created by Victoria on 3/3/2016.
 */
import {Component, Output, EventEmitter} from 'angular2/core';

@Component({
    selector: 'slider-button',
    templateUrl: './app/components/buttons/slider/slider.button.html',

    outputs: ['scrollRight', 'scrollLeft']
})
export class SliderButton{
  public scrollRight: EventEmitter<boolean> = new EventEmitter();
  public scrollLeft: EventEmitter<boolean> = new EventEmitter();

  left(){
      this.scrollLeft.next(true);
  }
  right(){
      this.scrollRight.next(true);
  }
}
