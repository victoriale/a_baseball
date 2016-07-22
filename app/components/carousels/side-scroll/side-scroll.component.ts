import {Component, AfterContentChecked, Input, Output, EventEmitter} from '@angular/core';

declare var jQuery:any
;
@Component({
    selector: 'side-scroll',
    templateUrl: './app/components/carousels/side-scroll/side-scroll.component.html',
    outputs: ['carouselCount']
})

export class SideScroll{
  @Input() current:any;
  @Input() data: any;
  public carouselCount = new EventEmitter();
  public count = 0;

  constructor(){

  }

  scroll(event){
    console.log(event);
  }

  counter(event){
  }

  left() {
  }
  right() {
  }

}
