import {Component,OnInit,EventEmitter,Input} from '@angular/core';
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";
import {DeepDiveService} from '../../services/deep-dive.service';


declare var jQuery:any;


@Component({
  selector: 'carousel-dive-module',
  templateUrl: './app/modules/carousel-dive/carousel-dive.module.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [DeepDiveService]

})

export class CarouselDiveModule implements OnInit{
  @Input() carouselData: any;
  @Input() state:any;
  public videoData:any;

  constructor(
      private _deepdiveservice:DeepDiveService
  ){
​      this.getDeepDiveVideoBatch(this.state, 4, 2);
  }
  private getDeepDiveVideoBatch(region, numItems, startNum){
      this._deepdiveservice.getDeepDiveVideoBatchService(numItems, startNum, region).subscribe(
        data => {
          this.videoData = data.data;
          console.log('hey there!', this.videoData);
        }
      )
    }




  ngOnInit() {
    setTimeout(function(){
      jQuery(".owl-carousel").owlCarousel({
        items:1,
        loop:true,
        dots:false,
        nav:false,
        navText:false
      });
    }, 500);
​
  }
  leftcarousel() {
    console.log('left arrow')
    var owl = jQuery('.carousel_owl');
    owl.owlCarousel();
    owl.trigger('prev.owl.carousel');
  }
  rightcarousel() {
    console.log('right arrow')
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
