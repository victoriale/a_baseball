import {Component,OnInit,EventEmitter,Input} from '@angular/core';
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";
import {DeepDiveService} from '../../services/deep-dive.service';
import {SanitizeRUrl, SanitizeHtml} from "../../pipes/safe.pipe";


declare var jQuery:any;
declare var moment;

@Component({
  selector: 'carousel-dive-module',
  templateUrl: './app/modules/carousel-dive/carousel-dive.module.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [DeepDiveService],
  pipes: [SanitizeRUrl,SanitizeHtml]

})

export class CarouselDiveModule{
  @Input() carouselData: any;
  @Input() state:any;
  public videoData:any;

  constructor(
      private _deepdiveservice:DeepDiveService
  ){
    window.addEventListener("resize", this.onResize);
  }
  private getDeepDiveVideoBatch(region, numItems, startNum){
      this._deepdiveservice.getDeepDiveVideoBatchService(numItems, startNum, region).subscribe(
        data => {
          this.videoData = data.data;
        }
      )
    }
    formatDate(date) {
      return moment(date, "YYYY-MM-Do, h:mm:ss").format("MMMM Do, YYYY h:mm:ss a");
    }


  ngOnInit() {
    this.getDeepDiveVideoBatch(this.state, 1, 1);

    setTimeout(function(){
      jQuery(".owl-carousel").owlCarousel({
        items:1,
        loop:true,
        dots:false,
        nav:false,
        navText:false,
        mouseDrag: false
      });

    }, 1000);

    //this.onResize(this._elRef.nativeElement);
  }

  onResize() {
    var iframe =  (<HTMLScriptElement[]><any>document.getElementsByClassName('carousel-video-iframe'))[0];
    var iframeHeight = iframe.offsetHeight;
    console.log(iframe, iframeHeight);

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
}
