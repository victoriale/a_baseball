import {Component, OnInit, Input, NgZone} from '@angular/core';

declare var jQuery:any
;
@Component({
    selector: 'side-scroll',
    templateUrl: './app/components/carousels/side-scroll/side-scroll.component.html',
    directives: [],
    providers: [],
})

export class SideScroll implements OnInit{
  constructor(
    ngZone:NgZone
  ){
    window.onresize = (e) =>
    {
      var width = window.outerWidth;
      var height = window.outerHeight;
    }
  }

  ngOnInit(){
    console.log(jQuery(".owl-carousel"));
    jQuery(".owl-carousel").owlCarousel({
      items:5,
      loop:true,
      dots:false,
      nav:false,
      navText:false
    });
  }

  left() {
    var owl = jQuery('.owl-carousel');
    owl.owlCarousel();
    owl.trigger('prev.owl.carousel');
  }
  right() {
    var owl = jQuery('.owl-carousel');
    owl.owlCarousel();
    owl.trigger('next.owl.carousel');
  }

}
