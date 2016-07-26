import {Component, OnChanges, Output, Input, EventEmitter, ElementRef} from '@angular/core';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {CalendarCarousel} from '../../components/carousels/calendar/calendarCar.component';
import {Competition} from '../../components/competition/competition.component';
import {ArticleScheduleComponent} from '../../components/articles/article-schedule/article-schedule.component';
import {GameInfo} from '../../components/game-info/game-info.component';
import {ScoreBoard} from '../../components/score-board/score-board.component';
import {GameArticle} from '../../components/game-article/game-article.component';
import {ScrollableContent} from '../../components/scrollable-content/scrollable-content.component';
import {ScrollerFunctions} from '../../global/scroller-functions';

@Component({
    selector: 'box-scores',
    templateUrl: './app/modules/box-scores/box-scores.module.html',
    directives: [ScrollableContent, GameArticle, ScoreBoard, GameInfo, ArticleScheduleComponent, CalendarCarousel,  ModuleHeader],
    providers: [ScrollerFunctions],
    outputs: ['dateEmit'],
})

export class BoxScoresModule implements OnChanges{
  @Input() calendarParams:any;
  @Input() boxScores:any;
  @Input() maxHeight:any;
  @Input() scroll:boolean;

  // private moduleHeight: string;
  public dateEmit = new EventEmitter();
  public liveArray = new EventEmitter();
  public heightStyle: string;
  private gameNum:number = 0;
  constructor(
    private _elementRef:ElementRef,
    private _scroller:ScrollerFunctions
  ){
  }

  dateTransfer(event){
    this.dateEmit.next(event);
  }

  changeGame(num){
    this.gameNum = num;
  }

  ngOnInit(){
    if(this.scroll){
      this.maxHeight = 650;
    }
    this.checkHeight();
  }

  ngOnChanges(){
    if(this.scroll){
      this.maxHeight = 650;
    }
    this.checkHeight();
  }

  checkHeight(){
    ScrollerFunctions.initializeScroller(this._elementRef.nativeElement, document);
    if(document.getElementById('box-header') != null && this.scroll && this.maxHeight != null && this.boxScores != null){
      var boxHeader = document.getElementById('box-header').offsetHeight;
      //only for mlb page but subtract the mod title and calendar height from what was sent in
      if(this.maxHeight != 'auto'){
        this.maxHeight -= boxHeader;
        this.heightStyle = this.maxHeight + "px";
      }else{
        this.scroll = false;
        this.heightStyle = 'auto';
      }
    }
  }
}
