import {Component} from '@angular/core';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {CalendarCarousel} from '../../components/calendar/carousel/calendarCar.component';
import {Competition} from '../../components/competition/competition.component';
import {GameInfo} from '../../components/game-info/game-info.component';
import {ScoreBoard} from '../../components/score-board/score-board.component';

interface BoxScores{

}

@Component({
    selector: 'box-scores',
    templateUrl: './app/modules/box-scores/box-scores.module.html',
    directives: [ScoreBoard, GameInfo, Competition, CalendarCarousel,  ModuleHeader],
    providers: [],
    inputs:[]
})

export class BoxScoresModule{
  constructor(){

  }
}
