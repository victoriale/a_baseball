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
    this.count = event;
    this.carouselCount.next(event);
  }

  left() {
    var owl = jQuery('.ss_owl');
    owl.owlCarousel();
    owl.trigger('prev.owl.carousel');
  }
  right() {
    var owl = jQuery('.ss_owl');
    owl.owlCarousel();
    owl.trigger('next.owl.carousel');
  }

}
