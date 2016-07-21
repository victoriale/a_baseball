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
    items:7,
    loop:false,
    dots:false,
    nav:false,
    navText:false
  }
  constructor(){
  }

  ngOnInit(){
    console.log(this.maxLength, this.current);
  }

  counter(event){
    this.count = event;
    this.carouselCount.emit(event);
  }

  left() {
    var owl = jQuery('.ss_owl');
    console.log('blarg');
    owl.owlCarousel();
    owl.trigger('prev.owl.carousel');
  }
  right() {
    var owl = jQuery('.ss_owl');
    console.log('blargenghei');
    owl.owlCarousel();
    owl.trigger('next.owl.carousel');
  }

}
