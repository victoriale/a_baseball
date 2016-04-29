import {Component} from 'angular2/core';
import {DetailedListItem} from '../../components/detailed-list-item/detailed-list-item';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {CalendarCarousel} from '../../components/calendar/carousel/calendarCar';
import {Competition} from '../../components/competition/competition';
import {GameInfo} from '../../components/game-info/game-info';
import {ScoreBoard} from '../../components/score-board/score-board';

interface BoxScores{

}

@Component({
    selector: 'box-scores',
    templateUrl: './app/modules/box-scores/box-scores.html',
    directives: [ScoreBoard, GameInfo, Competition, CalendarCarousel, DetailedListItem, ModuleHeader],
    providers: [],
    inputs:['locData']
})

export class BoxScoresModule{
  constructor(){

  }
}
