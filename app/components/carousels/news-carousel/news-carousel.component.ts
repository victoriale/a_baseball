/**
 * Created by Victoria on 4/19/2016.
 */
import {Component, OnInit, Output, Input, EventEmitter} from 'angular2/core';
import {Carousel} from '../carousel.component';
import {ModuleFooter, ModuleFooterData} from '../../module-footer/module-footer.component'

export interface NewsCarouselInput {
  backgroundImage?: string;
  description?: Array<string>;
  footerInfo?: ModuleFooterData;
}

@Component({
  selector: 'news-carousel',
  templateUrl: './app/components/carousels/news-carousel/news-carousel.component.html',
  directives: [ModuleFooter, Carousel],
  providers: [],
  outputs:['indexNum'],
})

export class NewsCarousel implements OnInit {
  @Input() carouselData: Array<NewsCarouselInput>;
  @Input() backgroundImage: string;

  public indexNum: EventEmitter<any> = new EventEmitter();//interface for the output to return an index
  public dataPoint: NewsCarouselInput;

  constructor() {

  }

  response(event){
    //set the data event being emitted back from the carousel component
    this.dataPoint = event;

    //sets the index of the dataPoint of its current position in the array
    // the '?' meaning if there is data to even receive
    if(typeof this.dataPoint['index'] != 'undefined'){
      this.indexNum.next(this.dataPoint['index']);
    }
  }

  ngOnInit() {
    //incase there is no backgroundImage being return set the default background
    if(typeof this.backgroundImage == 'undefined'){
      this.backgroundImage = '/app/public/baseball.png';
    }

    //In case of errors display below
    if (typeof this.dataPoint == 'undefined') {
      var sampleImage = "./app/public/homePage_hero1.jpg";
      this.dataPoint =
      {
        description: [
          "<p>Line1</p>",
          "<p>Line2</p>",
          "<p>Line3</p>",
          "<p>Line4</p>",
        ],
      };
    }
  }
}
