import {Component, AfterContentChecked, Input, EventEmitter} from '@angular/core';

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
  public carouselCount = new EventEmitter();

  constructor(){
  }

  ngAfterContentChecked(){
    var owl = jQuery('.owl-carousel');
    owl.owlCarousel({
      items:7,
      loop:false,
      dots:false,
      nav:false,
      navText:false,
      info:true,
    });
    owl.on('changed.owl.carousel', function(event) {
        var currentItem = event.item.index;
        // this.carouselCount.next(currentItem);
        window.location.hash = currentItem + 1;
    })
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
