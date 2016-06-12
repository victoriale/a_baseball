import {Component, OnInit, Input, EventEmitter} from 'angular2/core';
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
})

export class BoxScoresModule implements OnInit{
  @Input() calendarParams:any;
  @Input() boxScores:any;
  boxScheduleData:any;
  constructor(){}

  ngOnInit(){
    console.log('MODULE: BoxScores',this.boxScores);
    console.log('OnLoad Date',this.calendarParams);
    this.boxScheduleData = this.boxScores.schedule;
  }
}
