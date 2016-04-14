/**
 * Created by Victoria on 3/3/2016.
 */
import {Component, Output, EventEmitter} from 'angular2/core';

@Component({
    selector: 'circle-button',
    templateUrl: './app/components/buttons/circle/circle.button.html',
    
    outputs: ['scrollRight', 'scrollLeft']
})
export class CircleButton{
  public scrollRight: EventEmitter<boolean> = new EventEmitter();
  public scrollLeft: EventEmitter<boolean> = new EventEmitter();

  left(){
      this.scrollLeft.next(true);
  }
  right(){
      this.scrollRight.next(true);
  }
}
