import {Component, AfterContentChecked, Input, NgZone} from '@angular/core';

declare var jQuery:any
;
@Component({
    selector: 'side-scroll',
    templateUrl: './app/components/carousels/side-scroll/side-scroll.component.html',
    directives: [],
    providers: [],
})

export class SideScroll implements AfterContentChecked{
  @Input() carouselData:any;
  constructor(){
  }

  ngAfterContentChecked(){
    jQuery(".owl-carousel").owlCarousel({
      items:7,
      loop:false,
      dots:false,
      nav:false,
      navText:false
    });
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
