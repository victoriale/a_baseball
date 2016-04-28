import {Component} from 'angular2/core';
import {DetailedListItem} from '../../components/detailed-list-item/detailed-list-item';
import {ModuleHeader} from '../../components/module-header/module-header.component';

interface BoxScores{

}

@Component({
    selector: 'box-scores',
    templateUrl: './app/modules/box-scores/box-scores.html',
    directives: [DetailedListItem, ModuleHeader],
    providers: [],
    inputs:['locData']
})

export class BoxScoresModule{
  constructor(){

  }
}
