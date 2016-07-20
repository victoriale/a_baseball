import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router,ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {ImagesMedia} from "../../components/carousels/images-media-carousel/images-media-carousel.component";
import {ShareLinksComponent} from "../../components/articles/shareLinks/shareLinks.component";
import {RecommendationsComponent} from "../../components/articles/recommendations/recommendations.component";
import {SyndicatedTrendingComponent} from "../../components/articles/syndicated-trending/syndicated-trending.component";
import {DisqusComponent} from "../../components/articles/disqus/disqus.component";
import {LoadingComponent} from "../../components/loading/loading.component";
import {DeepDiveService} from '../../services/deep-dive.service'
import {GlobalFunctions} from "../../global/global-functions";
import {MLBGlobalFunctions} from "../../global/mlb-global-functions";
import {SidekickWrapperAI} from "../../components/sidekick-wrapper-ai/sidekick-wrapper-ai.component";
import {GlobalSettings} from "../../global/global-settings";
import {ResponsiveWidget} from '../../components/responsive-widget/responsive-widget.component';

declare var jQuery:any;

@Component({
    selector: 'syndicated-article-page',
    templateUrl: './app/webpages/syndicated-article-page/syndicated-article-page.page.html',
    directives: [
        SidekickWrapperAI,
        ROUTER_DIRECTIVES,
        ImagesMedia,
        ShareLinksComponent,
        RecommendationsComponent,
        DisqusComponent,
        LoadingComponent,
        SyndicatedTrendingComponent,
        ResponsiveWidget
    ],
    providers: [DeepDiveService],
})

export class SyndicatedArticlePage implements OnInit{
  public widgetPlace: string = "widgetForPage";
  public articleData: any;
  constructor(
    private _router:Router,
    private _deepdiveservice:DeepDiveService
    ){
      this.getDeepDiveArticle();
    }
    private getDeepDiveArticle() {
      this._deepdiveservice.getDeepDiveArticleService().subscribe(
        data => {
          this.articleData = data.data[0];
          console.log(data.data[0]);
        }
      )
    }
    ngOnInit() {

    }
}
