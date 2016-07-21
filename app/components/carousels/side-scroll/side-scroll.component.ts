import {Component, AfterContentChecked, Input, Output, EventEmitter} from '@angular/core';
import { OwlCarousel } from '../owl-carousel/owl-carousel.component';

declare var jQuery:any
;
@Component({
    selector: 'side-scroll',
    templateUrl: './app/components/carousels/side-scroll/side-scroll.component.html',
    directives: [OwlCarousel],
    outputs: ['carouselCount']
})

export class SideScroll{
  @Input() maxLength: any;
  @Input() current:any;
  @Input() data: any;
  public carouselCount = new EventEmitter();
  public count = 0;

  public options: Object = {
    responsiveClass:true,
    responsive:{
      0:{
          items:3,
          nav:false,
          navText:false,
          loop:false
      },
      640:{
          items:4,
          nav:false,
          navText:false,
          loop:false
      },
      768:{
          items:6,
          nav:false,
          navText:false,
          loop:false
      },
      1024:{
          items:4,
          nav:false,
          navText:false,
          loop:false
      },
      1440:{
          items:7,
          nav:false,
          navText:false,
          loop:false
      }
    }
  }

  constructor(){

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
