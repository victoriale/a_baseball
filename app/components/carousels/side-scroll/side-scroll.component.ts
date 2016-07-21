import {Component, AfterContentChecked, Input, Output, EventEmitter} from '@angular/core';

declare var jQuery:any
;
@Component({
    selector: 'side-scroll',
    templateUrl: './app/components/carousels/side-scroll/side-scroll.component.html',
    outputs: ['carouselCount']
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
        if(self.count != currentItem){
          self.carouselCount.next(currentItem);
        }
        self.count = currentItem;
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
