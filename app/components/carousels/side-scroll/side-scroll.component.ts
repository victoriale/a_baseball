import {Component, AfterContentChecked, Input, Output, EventEmitter} from '@angular/core';

declare var jQuery:any;

@Component({
    selector: 'side-scroll',
    templateUrl: './app/components/carousels/side-scroll/side-scroll.component.html',
    outputs: ['carouselCount']
})

export class SideScroll implements AfterContentChecked{
  @Input() maxLength:any;
  @Input() current:any;
  public carouselCount = new EventEmitter();
  public count = 0;
  constructor(){
  }

  ngAfterContentChecked(){
<<<<<<< HEAD
    // var owl = jQuery('.owl-carousel');
    // owl.owlCarousel({
    //   items:7,
    //   loop:false,
    //   dots:false,
    //   nav:false,
    //   navText:false,
    //   info:true,
    // });
    // owl.on('changed.owl.carousel', function(event) {
    //     var currentItem = event.item.index;
    //     // this.carouselCount.next(currentItem);
    //     window.location.hash = currentItem + 1;
    // })
=======
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
>>>>>>> 6f9d45b7112dd888897836cc71be0ea84e5eb1a0
  }

  // left() {
  //   var owl = jQuery('.ss_owl');
  //   owl.owlCarousel();
  //   owl.trigger('prev.owl.carousel');
  // }
  // right() {
  //   var owl = jQuery('.ss_owl');
  //   owl.owlCarousel();
  //   owl.trigger('next.owl.carousel');
  // }

}
