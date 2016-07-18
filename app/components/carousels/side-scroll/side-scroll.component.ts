import {Component, OnInit, Input} from '@angular/core';

declare var jQuery:any
;
@Component({
    selector: 'side-scroll',
    templateUrl: './app/components/carousels/side-scroll/side-scroll.component.html',
    directives: [],
    providers: [],
})

export class SideScroll implements OnInit{

  ngOnInit(){
    jQuery(".owl-carousel").owlCarousel({
      items:5,
      loop:true,
      dots:false,
      nav:false,
      navText:false
    });
  }

  left() {
    var owl = jQuery('#ss_owl');
    owl.owlCarousel();
    owl.trigger('prev.owl.carousel');
  }
  right() {
    var owl = jQuery('#ss_owl');
    owl.owlCarousel();
    owl.trigger('next.owl.carousel');
  }

}
