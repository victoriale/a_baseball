import {Component, OnChanges, Output, Input, EventEmitter} from '@angular/core';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {CalendarCarousel} from '../../components/carousels/calendar/calendarCar.component';
import {Competition} from '../../components/competition/competition.component';
import {ArticleScheduleComponent} from '../../components/articles/article-schedule/article-schedule.component';
import {GameInfo} from '../../components/game-info/game-info.component';
import {ScoreBoard} from '../../components/score-board/score-board.component';
import {GameArticle} from '../../components/game-article/game-article.component';
import {ScrollableContent} from '../../components/scrollable-content/scrollable-content.component';

@Component({
    selector: 'box-scores',
    templateUrl: './app/modules/box-scores/box-scores.module.html',
    directives: [ScrollableContent, GameArticle, ScoreBoard, GameInfo, ArticleScheduleComponent, CalendarCarousel,  ModuleHeader],
    providers: [],
    outputs: ['dateEmit'],
})

export class BoxScoresModule implements OnChanges{
  @Input() calendarParams:any;
  @Input() boxScores:any;
  @Input() maxHeight:any;
  @Input() scroll:boolean;

  // private moduleHeight: string;
  public dateEmit = new EventEmitter();
  private gameNum:number = 0;
  constructor(){}

  dateTransfer(event){
    this.dateEmit.next(event);
  }

  changeGame(num){
    this.gameNum = num;
  }

  ngOnChanges(){
    if(document.getElementById('box-header') != null && this.scroll && this.maxHeight != null){
      var boxHeader = document.getElementById('box-header').offsetHeight;
      //only for mlb page but subtract the mod title and calendar height from what was sent in
      if(this.maxHeight != 'auto'){
        this.maxHeight -= boxHeader;
        this.maxHeight = this.maxHeight + "px";
      }else{
        this.scroll = false;
      }
    }
  }
}
