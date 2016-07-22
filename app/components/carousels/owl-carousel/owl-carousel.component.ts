import { Component, Input, Output, OnInit, EventEmitter, ElementRef } from '@angular/core';
declare var jQuery:any;
import 'owl-carousel';

@Component({
    selector: 'owl-carousel',
    templateUrl: './app/components/carousels/owl-carousel/owl-carousel.component.html',
    outputs: ['carouselCount']
})

export class OwlCarousel implements OnInit{
  @Input() options: Object;
  @Input() data: any;
  carouselCount = new EventEmitter();
  count: number = 0;
  owlElement: any;

  constructor(private _el: ElementRef) {}

  ngOnInit() {
    let self = this;
    this.owlElement = jQuery(this._el.nativeElement).owlCarousel(this.options);
    this.owlElement.on('changed.owl.carousel', function(event) {
        var currentItem = event.item.index;
        if(self.count != currentItem){
          self.carouselCount.next(currentItem);
        }
        self.count = currentItem;
    })
  }

  ngOnChanges(){
  }
}
