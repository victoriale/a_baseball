import {Component, Input} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {NewsCarousel, NewsCarouselInput} from '../../components/carousels/news-carousel/news-carousel.component';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';
import {NewsData, NewsService} from '../../services/news.service';

declare var moment: any;

@Component({
    selector: 'news-module',
    templateUrl: './app/modules/news/news.module.html',
    directives: [ModuleHeader, NewsCarousel, ModuleFooter],
    providers: [NewsService]
})

export class NewsModule {
    @Input() newsData: NewsData;
    footerData: Object;
    newsItems: Object;
    carouselData: any;
    public newsBlocks: Array<NewsData> = [];
    public newsContent: Array<string> = [];
    moduleTitle: ModuleHeaderData = {
      moduleTitle: "Other Content You Will Love - [Profile Name]",
      hasIcon: false,
      iconClass: "fa fa-heart"
    };
    constructor(private _service: NewsService){
      this._service.getDefaultData().subscribe(
        data => this.setupData(data),
        err => { console.log("Error getting News data"); }
      );
    }

    setupData(data: NewsData){
      console.log(data, 'data link', data.link);
      if ( data !== undefined && data !== null ) {
        this.footerData = {
          infoDesc:'Want to check out the full story?',
          btn:'',
          text:'READ THE ARTICLE',
          url: data.link,
        }
        this.newsItems = {
          title: data.title,
          description: data.description,
          tags: data.tags,
          published: data.pubDate_ut
        }
      } else {
        console.log("Error setting up news data");
      }
    }
}
