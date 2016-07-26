import {Component,OnInit,EventEmitter,Input} from '@angular/core';
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";
import {SanitizeHtml} from "../../pipes/safe.pipe";

declare var jQuery:any;


@Component({
  selector: 'carousel-dive-module',
  templateUrl: './app/modules/carousel-dive/carousel-dive.module.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [],
  pipes:[SanitizeHtml]
})

export class CarouselDiveModule{
  @Input() carouselData: any;

  ngOnInit() {
    setTimeout(function(){
      jQuery(".owl-carousel").owlCarousel({
        items:1,
        loop:true,
        dots:false,
        nav:false,
        navText:false
      });
    }, 1000);
  }

  leftcarousel() {
    var owl = jQuery('.carousel_owl');
    owl.owlCarousel();
    owl.trigger('prev.owl.carousel');
  }
  rightcarousel() {
    var owl = jQuery('.carousel_owl');
    owl.owlCarousel();
    owl.trigger('next.owl.carousel');
  }
​
​
​
​
​
​
}
