import { Component, Input, Output, AfterViewInit, EventEmitter, ElementRef } from '@angular/core';
// declare var jQuery:any;
// import 'owl-carousel';

@Component({
    selector: 'owl-carousel',
    templateUrl: './app/components/carousels/owl-carousel/owl-carousel.component.html',
    outputs: ['carouselCount']
})

export class OwlCarousel{
  // @Input() options: Object;
  // @Input() data: any;
  // carouselCount = new EventEmitter();
  // count: number = 0;
  // owlElement: any;
  //
  // constructor(private _el: ElementRef) {}
  //
  // ngAfterViewInit() {
  //   let self = this;
  //
  //   this.owlElement = jQuery(this._el.nativeElement).owlCarousel(this.options);
  //   this.owlElement.on('changed.owl.carousel', function(event) {
  //       var currentItem = event.item.index;
  //       if(self.count != currentItem){
  //         self.carouselCount.next(currentItem);
  //       }
  //       self.count = currentItem;
  //   })
  // }
  //
  // ngOnDestroy() {
  //   this.owlElement.remove();
  //   this.owlElement = null;
  // }
  //
  // ngOnChanges(){
  //   let self = this;
  //   if(this.owlElement != null){
  //     this.data.forEach(function(val,i){
  //       this.owlElement.data('owlCarousel').addItem(val);
  //     })
  //   }
  // }
}
