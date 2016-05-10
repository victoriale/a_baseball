import {Component, OnInit, Input} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {NewsCarousel, NewsCarouselInput} from '../../components/carousels/news-carousel/news-carousel.component';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';
import {NewsService} from '../../services/news.service';
import {RouteParams} from "angular2/router";
import {GlobalFunctions} from '../../global/global-functions';

@Component({
    selector: 'news-module',
    templateUrl: './app/modules/news/news.module.html',
    directives: [ModuleHeader, NewsCarousel, ModuleFooter],
    providers: [NewsService]
})

export class NewsModule implements OnInit {
    footerData: Object;
    public newsData: Array<any> = [];
    newsDataArray: any;
    moduleTitle: ModuleHeaderData = {
      moduleTitle: "Other Content You Will Love - [Profile Name]",
      hasIcon: false,
      iconClass: "fa fa-heart"
    };

    constructor(private _params: RouteParams,
                private _globalFunctions: GlobalFunctions,
                private _newsService: NewsService){

    }

    private setupNewsData(){
      let self = this;
      self._newsService.getNewsService("Steven Lerud")
        .subscribe(data => {
          console.log("setupNewsData", data.news);
          this.newsDataArray = data.news;
        },
        err => {
          console.log("Error getting news data");
        });
      }

    ngOnInit(){
      this.setupNewsData();
    }

}
