import {Component, Input, Injector, OnChanges} from '@angular/core';
import {GlobalSettings} from '../../../global/global-settings';
import {GlobalFunctions} from '../../../global/global-functions';
import {DeepDiveService} from '../../../services/deep-dive.service';
import {Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {ArticleStackModule} from '../../../modules/article-stack/article-stack.module';
import {TileStackModule} from '../../../modules/tile-stack/tile-stack.module';
import {ResponsiveWidget} from '../../../components/responsive-widget/responsive-widget.component';
import {VideoStackComponent} from '../../../components/video-stack/video-stack.component';
import {BoxScoresModule} from '../../../modules/box-scores/box-scores.module';
import {BoxScoresService} from '../../../services/box-scores.service';
import {BoxArticleComponent} from '../../../components/box-article/box-article.component';

@Component({
    selector: 'deep-dive-block-1',
    templateUrl: './app/modules/deep-dive-blocks/deep-dive-block-1/deep-dive-block-1.module.html',
    directives: [ROUTER_DIRECTIVES, ArticleStackModule, TileStackModule, ResponsiveWidget, VideoStackComponent, BoxScoresModule, BoxArticleComponent],
    providers: [DeepDiveService, BoxScoresService]
})
export class DeepDiveBlock1{
  public widgetPlace: string = "widgetForPage";
  firstStackTop: any;
  firstStackRow: any;
  secStackTop: any;
  secStackRow: any;
  thirdStackTop: any;
  thirdStackRow: any;
  callLimit:number = 8;
  tilestackData: any;

  //for box scores
  boxScoresData: any;
  videoData: any;
  currentBoxScores: any;
  page: number = 1;
  dateParam: any;
  @Input() maxHeight: any;
  scroll: boolean = true;
  @Input() geoLocation: any;
  @Input() profileName: any;

  constructor(
    private _router:Router,
    private _boxScores:BoxScoresService,
    private _deepDiveData: DeepDiveService
    ){
      var currentUnixDate = new Date().getTime();
      //convert currentDate(users local time) to Unix and push it into boxScoresAPI as YYYY-MM-DD in EST using moment timezone (America/New_York)
      this.dateParam ={
        profile:'league',//current profile page
        teamId:null,
        date: GlobalFunctions.getDateElement(currentUnixDate, "fullDate"),
      }
      window.onresize = (e) =>
      {
        // current use is box scores
        this.checkSize();
      }
    }

  ngOnInit() {
     this.callModules();
  }
  getFirstArticleStackData(){
    this._deepDiveData.getDeepDiveBatchService(this.callLimit, 1, this.geoLocation)
        .subscribe(data => {
          this.firstStackTop = this._deepDiveData.transformToArticleStack(data);
        });
    this._deepDiveData.getDeepDiveAiBatchService(this.geoLocation)
        .subscribe(data => {
          this.firstStackRow = this._deepDiveData.transformToAiArticleRow(data);
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
  private getDeepDiveVideoBatch(region, numItems, startNum){
    this._deepDiveData.getDeepDiveVideoBatchService(numItems, startNum, region).subscribe(
      data => {
        this.videoData = data.data;
      }
    )
  }
  //api for BOX SCORES
  private getBoxScores(dateParams?) {
      if (dateParams != null) {
          this.dateParam = dateParams;
      }
      this._boxScores.getBoxScores(this.boxScoresData, this.profileName, this.dateParam, (boxScoresData, currentBoxScores) => {
          this.boxScoresData = boxScoresData;
          this.currentBoxScores = currentBoxScores;
      })
  }
  checkSize(){
    var width = window.outerWidth;
    var height = window.outerHeight;
    if(width <= 640){
      this.scroll = false;
      this.maxHeight = 'auto';
    }else if(width > 640){
      this.scroll = true;
      this.maxHeight = 650;
    }
  }
  callModules(){
    this.getBoxScores(this.dateParam);
    this.getFirstArticleStackData();
    this.getSecArticleStackData();
    this.getDeepDiveVideoBatch(this.geoLocation, 6, this.page);
    this.getThirdArticleStackData();
    this.getTileStackData();
  }

}
