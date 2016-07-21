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
  public count = 0;
  constructor(){
  }

  ngAfterContentChecked(){
    var self = this;
    var owl = jQuery('.ss_owl');
    owl.owlCarousel({
      items:7,
      loop:false,
      dots:false,
      nav:false,
      navText:false,
    });
    owl.on('changed.owl.carousel', function(event) {
        var currentItem = event.item.index;
        // console.log(currentItem)
        self.carouselCount.next(currentItem);
        // console.log('emitting');
    })
  }

  ngDoCheck(){
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
