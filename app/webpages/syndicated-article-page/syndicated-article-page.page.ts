import {Component, AfterViewInit} from '@angular/core';
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
import {SanitizeRUrl, SanitizeHtml} from "../../pipes/safe.pipe";
import {GeoLocation} from "../../global/global-service";
import {PartnerHeader} from "../../global/global-service";


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
    providers: [DeepDiveService, GeoLocation, PartnerHeader],
    pipes: [SanitizeRUrl, SanitizeHtml]
})

export class SyndicatedArticlePage{
  public partnerID: string;
  public geoLocation:string;

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
    private _deepdiveservice:DeepDiveService,
    private _geoLocation:GeoLocation,
    private _partnerData: PartnerHeader
    ){
      this.eventID = _params.get('eventID');
      this.articleType = _params.get('articleType');
      if (this.articleType == "story") {
        this.getDeepDiveArticle(this.eventID);
      }
      else {
        this.getDeepDiveVideo(this.eventID);
      }

      GlobalSettings.getPartnerID(_router, partnerID => {
          this.partnerID = partnerID;
          this.getPartnerHeader();
      });
    }

    ngAfterViewInit(){
      // to run the resize event on load
      try {
        window.dispatchEvent(new Event('load'));
      }catch(e){
        //to run resize event on IE
        var resizeEvent = document.createEvent('UIEvents');
        resizeEvent.initUIEvent('load', true, false, window, 0);
        window.dispatchEvent(resizeEvent);
      }
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
            this.imageData = [GlobalSettings.getImageUrl(data.data.imagePath)];
            this.copyright = ["USA Today Sports Images"];
            this.imageTitle = [""];
          }
          this.articleData = data.data;
          this.articleData.publishedDate = moment.unix(this.articleData.publishedDate/1000).format("MMMM Do, YYYY h:mm A") + " EST";
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

    getGeoLocation() {
      var defaultState = 'ca';
        this._geoLocation.getGeoLocation()
            .subscribe(
                geoLocationData => {
                  this.geoLocation = geoLocationData[0].state;
                  this.geoLocation = this.geoLocation.toLowerCase();
                  this.getRecomendationData();
                },
                err => {
                  this.geoLocation = defaultState;
                  this.getRecomendationData();
                }
            );
    }

    getPartnerHeader(){//Since it we are receiving
      if(this.partnerID != null){
        this._partnerData.getPartnerData(this.partnerID)
        .subscribe(
          partnerScript => {
            //super long way from partner script to get location using geo location api
            var state = partnerScript['results']['location']['realestate']['location']['city'][0].state;
            state = state.toLowerCase();
            this.geoLocation = state;
            this.getRecomendationData()
          }
        );
      }else{
        this.getGeoLocation();
      }
    }

    getRecomendationData(){
      var state = this.geoLocation.toUpperCase(); //needed to uppoercase for ai to grab data correctly
      this._deepdiveservice.getRecArticleData(state, '1', '1')
          .subscribe(data => {
            this.recomendationData = this._deepdiveservice.transformToRecArticles(data);
            this.recomendationData = [this.recomendationData[0], this.recomendationData[1], this.recomendationData[2]];
          });
    }
}
