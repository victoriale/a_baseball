import {Component, OnInit, Input} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {NewsCarousel, NewsCarouselInput} from '../../components/carousels/news-carousel/news-carousel.component';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';
import {NewsService} from '../../services/news.service';
import {RouteParams} from "angular2/router";
import {GlobalFunctions} from '../../global/global-functions';
import {CircleButton} from "../../components/buttons/circle/circle.button";

@Component({
    selector: 'news-module',
    templateUrl: './app/modules/news/news.module.html',
    directives: [ModuleHeader, NewsCarousel, ModuleFooter, CircleButton],
    providers: [NewsService]
})

export class NewsModule implements OnInit {
    public counter: number = 0;
    public max:number;
    footerData: Object;
    public displayData: Object;
    newsDataArray: any;
    moduleTitle: ModuleHeaderData = {
      moduleTitle: "Other Content You Will Love - [Profile Name]",
      hasIcon: true,
      iconClass: "fa fa-heart"
    };

    constructor(private _params: RouteParams,
                private _globalFunctions: GlobalFunctions,
                private _newsService: NewsService){

    }
    left(){
      var counter = this.counter;
      counter--;

      //make a check to see if the array is below 0 change the array to the top level
      if(counter < 0){
        this.counter = (this.max - 1);
      }else{
        this.counter = counter;
      }
      this.changeMain(this.counter);
    }

    right(){
      var counter = this.counter;
      counter++;
      //check to see if the end of the obj array of images has reached the end and will go on the the next obj with new set of array
      if(counter == this.max){
        this.counter = 0;
      }else{
        this.counter = counter;
      }
      this.changeMain(this.counter);
    }


    //this is where the angular2 decides what is the main image
    changeMain(num){
      if ( num < this.max ) {
        this.displayData = this.newsDataArray[num];
      };
    }

    private setupNewsData(){
      let self = this;
      self._newsService.getNewsService("Steven Lerud")
        .subscribe(data => {
          this.newsDataArray = data.news;
          // this.max = this.newsDataArray.length;
          this.max = 10;
          this.changeMain(this.counter);
        },
        err => {
          console.log("Error getting news data");
        });
      }

    ngOnInit(){
      this.setupNewsData();
    }

}
