import {Component, Input, Injector, OnChanges} from '@angular/core';
import {GlobalSettings} from '../../../global/global-settings';
import {GlobalFunctions} from '../../../global/global-functions';
import {DeepDiveService} from '../../../services/deep-dive.service';
import {Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {ArticleStackModule} from '../../../modules/article-stack/article-stack.module';
import {TileStackModule} from '../../../modules/tile-stack/tile-stack.module';
import {ResponsiveWidget} from '../../../components/responsive-widget/responsive-widget.component';
import {VideoStackComponent} from '../../../components/video-stack/video-stack.component';
import {RecommendationsComponent} from '../../../components/articles/recommendations/recommendations.component';



@Component({
    selector: 'deep-dive-block-3',
    templateUrl: './app/modules/deep-dive-blocks/deep-dive-block-3/deep-dive-block-3.module.html',
    directives: [ROUTER_DIRECTIVES, ArticleStackModule, TileStackModule, ResponsiveWidget, VideoStackComponent, RecommendationsComponent],
    providers: [DeepDiveService]
})
export class DeepDiveBlock3{
  public widgetPlace: string = "widgetForPage";
  firstStackTop: any;
  firstStackRow: any;
  secStackTop: any;
  secStackRow: any;
  thirdStackTop: any;
  thirdStackRow: any;
  callLimit:number = 8;
  tilestackData: any;
  videoData: any;
  page: number = 3;
  recommendationData: any;
  boxArticleData: any;

  @Input() maxHeight: any;
  scroll: boolean = true;
  @Input() geoLocation: any;
  @Input() profileName: any;

  constructor(
    private _router:Router,
    private _deepDiveData: DeepDiveService
    ){
    }
    ngOnInit() {
       this.callModules();
    }
  getFirstArticleStackData(){
    this._deepDiveData.getDeepDiveBatchService(this.callLimit, 1, this.geoLocation)
        .subscribe(data => {
          this.firstStackTop = this._deepDiveData.transformToArticleStack(data);
          this.firstStackRow = this._deepDiveData.transformToArticleRow(data);
        });
  }
  getSecArticleStackData(){
    this._deepDiveData.getDeepDiveBatchService(this.callLimit, 2, this.geoLocation)
        .subscribe(data => {
          this.secStackTop = this._deepDiveData.transformToArticleStack(data);
          this.secStackRow = this._deepDiveData.transformToArticleRow(data);
        });
  }
  getThirdArticleStackData(){
    this._deepDiveData.getDeepDiveBatchService(this.callLimit, 3, this.geoLocation)
        .subscribe(data => {
          this.thirdStackTop = this._deepDiveData.transformToArticleStack(data);
          this.thirdStackRow = this._deepDiveData.transformToArticleRow(data);
        });
  }
  getTileStackData(){
    this._deepDiveData.getDeepDiveBatchService(this.callLimit, 2, this.geoLocation)
        .subscribe(data => {
          this.tilestackData = this._deepDiveData.transformTileStack(data);
        });
  }
  getRecommendationData(){
    var state = this.geoLocation; //required from AI to have the call of state come in UPPERCASE
    this._deepDiveData.getRecArticleData(state, '2', '6')
        .subscribe(data => {
          this.recommendationData = this._deepDiveData.transformToRecArticles(data);
        });
  }
  private getDeepDiveVideoBatch(region, numItems, startNum){
    this._deepDiveData.getDeepDiveVideoBatchService(numItems, startNum, region).subscribe(
      data => {
        this.videoData = data.data;
      }
    )
  }

  callModules(){
    this.getRecommendationData();
    this.getFirstArticleStackData();
    this.getSecArticleStackData();
    this.getDeepDiveVideoBatch(this.geoLocation, 6, this.page);
    this.getThirdArticleStackData();
    this.getTileStackData();
  }

}
