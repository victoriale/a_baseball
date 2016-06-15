import {Component, OnInit, Output, Input, EventEmitter} from 'angular2/core';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {CalendarCarousel} from '../../components/carousels/calendar/calendarCar.component';
import {Competition} from '../../components/competition/competition.component';
import {ArticleScheduleComponent} from '../../components/articles/article-schedule/article-schedule.component';
import {GameInfo} from '../../components/game-info/game-info.component';
import {ScoreBoard} from '../../components/score-board/score-board.component';

interface BoxScores{

}

@Component({
    selector: 'box-scores',
    templateUrl: './app/modules/box-scores/box-scores.module.html',
    directives: [ScoreBoard, GameInfo, ArticleScheduleComponent, CalendarCarousel,  ModuleHeader],
    providers: [],
    outputs: ['dateEmit'],
})

export class BoxScoresModule implements OnInit{
  @Input() calendarParams:any;
  @Input() boxScores:any;
  public dateEmit: EventEmitter<any> = new EventEmitter();
  boxScheduleData:any;
  constructor(){}

  dateTransfer(event){
    this.dateEmit.next(event);
  }
  ngOnInit(){
    this.boxScheduleData = this.boxScores.schedule;
  }
  ngOnChanges(){
    this.boxScheduleData = this.boxScores.schedule;
    console.log('MODULE: BoxScores',this.boxScores);
    console.log('CHANGES: GAMEINFO',this.boxScores.gameInfo);
    console.log('CHANGES: SCOREBOARD',this.boxScores.scoreBoard);
    console.log('CHANGES: SCHEDULE',this.boxScheduleData);
  }
}
