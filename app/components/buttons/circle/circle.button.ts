/**
 * Created by Victoria on 3/3/2016.
 */
import {Component, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'circle-button',
    templateUrl: './app/components/buttons/circle/circle.button.html',

    outputs: ['scrollRight', 'scrollLeft']
})
export class CircleButton{
  public scrollRight = new EventEmitter();
  public scrollLeft = new EventEmitter();
  
  left(){
      this.scrollLeft.next(true);
  }
  right(){
      this.scrollRight.next(true);
  }
}
