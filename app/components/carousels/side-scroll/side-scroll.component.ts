import {Component, AfterContentChecked, Input, Output, EventEmitter, ElementRef} from '@angular/core';
import 'owl-carousel';
declare var jQuery:any;

@Component({
    selector: 'side-scroll',
    templateUrl: './app/components/carousels/side-scroll/side-scroll.component.html',
    outputs: ['carouselCount']
})

export class SideScroll{
  @Input() options: Object;
  @Input() maxLength:any;
  @Input() current:any;
  public carouselCount = new EventEmitter();
  public count = 0;

  owlElement: any;
  defaultOptions: Object = {};

  constructor(private _el: ElementRef){
  }

  ngAfterViewInit() {
    for (var key in this.options) {
      this.defaultOptions[key] = this.options[key];
    }
    this.owlElement = jQuery(this._el.nativeElement).owlCarousel(this.defaultOptions);
  }

  ngOnDestroy() {
    this.owlElement.data('owlCarousel').destroy();
    this.owlElement = null;
  }
  // ngAfterContentChecked(){
  //   var self = this;
  //   var owl = jQuery('.ss_owl');
  //   owl.owlCarousel({
  //     items:7,
  //     loop:false,
  //     dots:false,
  //     nav:false,
  //     navText:false,
  //   });
  //   owl.on('changed.owl.carousel', function(event) {
  //       var currentItem = event.item.index;
  //       if(self.count != currentItem){
  //         self.carouselCount.next(currentItem);
  //       }
  //       self.count = currentItem;
  //   })
  // }

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
