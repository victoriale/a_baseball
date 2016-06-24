import {Component, OnChanges, Output, Input, EventEmitter} from 'angular2/core';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {CalendarCarousel} from '../../components/carousels/calendar/calendarCar.component';
import {Competition} from '../../components/competition/competition.component';
import {ArticleScheduleComponent} from '../../components/articles/article-schedule/article-schedule.component';
import {GameInfo} from '../../components/game-info/game-info.component';
import {ScoreBoard} from '../../components/score-board/score-board.component';
import {GameArticle} from '../../components/game-article/game-article.component';

@Component({
    selector: 'box-scores',
    templateUrl: './app/modules/box-scores/box-scores.module.html',
    directives: [GameArticle, ScoreBoard, GameInfo, ArticleScheduleComponent, CalendarCarousel,  ModuleHeader],
    providers: [],
    outputs: ['dateEmit'],
})

export class BoxScoresModule implements OnChanges{
  @Input() calendarParams:any;
  @Input() boxScores:any;
  public dateEmit: EventEmitter<any> = new EventEmitter();
  private gameNum:number = 0;
  constructor(){}

  dateTransfer(event){
    console.log('RECEIVE',event);
    console.log('NOW EMIT',event);
    this.dateEmit.next(event);
  }

  changeGame(num){
    this.gameNum = num;
  }

  ngOnChanges(){

  }
}
