import {Component} from 'angular2/core';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {CalendarCarousel} from '../../components/calendar/carousel/calendarCar.component';
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
    inputs:['boxScores']
})

export class BoxScoresModule implements OnInit{
  boxScores:any;
  boxScheduleData:any;
  constructor(){}

  ngOnInit(){
    console.log(this.boxScores);
    this.boxScheduleData = this.boxScores.schedule;
  }
}
