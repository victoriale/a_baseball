/**
 * Created by Victoria on 4/19/2016.
 */
import {Component, OnInit, Output, Input, EventEmitter} from '@angular/core';
import {Carousel} from '../carousel.component';
declare var stButtons: any;

export interface NewsCarouselInput {
  index?:any;
  description?: Array<string>;
}

@Component({
  selector: 'news-carousel',
  templateUrl: './app/components/carousels/news-carousel/news-carousel.component.html',
  directives: [Carousel],
  providers: [],
  inputs: ['newsData'],
  outputs:['indexNum'],
})

export class NewsCarousel implements OnInit {
  public indexNum = new EventEmitter();//interface for the output to return an index
  public newsData: NewsCarouselInput;
  public locateShareThis = function(){
    stButtons.locateElements();
  };
  response(event){
    this.newsData = event;
    if(typeof this.newsData['index'] != 'undefined'){
      this.indexNum.next(this.newsData['index']);
    }
  }

  ngOnInit() {

  }
}
