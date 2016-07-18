import {Component,OnInit,EventEmitter} from '@angular/core';
declare var jQuery:any;


@Component({
  selector: 'carousel-dive-module',
  templateUrl: './app/modules/carousel-dive/carousel-dive.module.html',
  directives: [],
  providers: []
})

export class CarouselDiveModule implements OnInit{
  constructor(){

  }
  ngOnInit() {
    jQuery(".owl-carousel").owlCarousel({
      items:1,
      loop:true,
      dots:false,
      nav:false,
      navText:false
    });


  }
  leftcarousel() {
    console.log('left arrow')
    var owl = jQuery('.owl-carousel');
    owl.owlCarousel();
    owl.trigger('prev.owl.carousel');
  }
  rightcarousel() {
    console.log('right arrow')
    var owl = jQuery('.owl-carousel');
    owl.owlCarousel();
    owl.trigger('next.owl.carousel');
  }





}
