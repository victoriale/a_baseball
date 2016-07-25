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
import {SanitizeRUrl} from "../../pipes/safe.pipe";
import {SanitizeHtml} from "../../pipes/safe.pipe";


declare var jQuery:any;
declare var moment;

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
    pipes: [SanitizeRUrl]
})

export class SyndicatedArticlePage implements OnInit{
  public widgetPlace: string = "widgetForPage";
  public articleData: any;
  public recomendationData: any;
  public eventID: string;
  public articleType: string;
  public imageData: Array<string>;
  public imageTitle: Array<string>;
  public copyright: Array<string>;
  iframeUrl: any;
  constructor(
    private _params:RouteParams,
    private _router:Router,
    private _deepdiveservice:DeepDiveService
    ){
      this.eventID = _params.get('eventID');
      this.articleType = _params.get('articleType');
      if (this.articleType == "story") {
        this.getDeepDiveArticle(this.eventID);
      }
      else {
        this.getDeepDiveVideo(this.eventID);
      }
      this.getRecomendationData();
    }
    private getDeepDiveArticle(articleID) {
      this._deepdiveservice.getDeepDiveArticleService(articleID).subscribe(
        data => {

          if (data.data.imagePath == null || data.data.imagePath == undefined || data.data.imagePath == "") {
            this.imageData  = ["/app/public/stockphoto_bb_1.jpg", "/app/public/stockphoto_bb_2.jpg"];
            this.copyright = ["USA Today Sports Images", "USA Today Sports Images"];
            this.imageTitle = ["", ""];
          }
          else {
            this.imageData = ["https://prod-sports-images.synapsys.us" + data.data.imagePath];
            this.copyright = ["USA Today Sports Images"];
            this.imageTitle = [""];
          }
          this.articleData = data.data;
          console.log(this.articleData.publishedDate);
          this.articleData.publishedDate = moment(this.articleData.publishedDate, "YYYY-MM-Do, h:mm:ss").format("MMMM Do, YYYY h:mm:ss a");
        }
      )
    }
    private getDeepDiveVideo(articleID){
      this._deepdiveservice.getDeepDiveVideoService(articleID).subscribe(
        data => {
          this.articleData = data.data;
          this.iframeUrl = this.articleData.videoLink + "&autoplay=on";
        }
      )
    }
    getRecomendationData(){
      this._deepdiveservice.getAiArticleData()
          .subscribe(data => {
            this.recomendationData = this._deepdiveservice.transformToRecArticles(data);
            this.recomendationData = [this.recomendationData[0]];
          });
    }
    ngOnInit() {

    }
}
