import {Component} from 'angular2/core';
import {DetailedListItem} from '../../components/detailed-list-item/detailed-list-item';
import {ModuleFooter} from '../../components/module-footer/module-footer';

interface DraftHistory{

}

@Component({
    selector: 'draft-history',
    templateUrl: './app/modules/draft-history/draft-history.html',
    directives: [DetailedListItem, ModuleFooter],
    providers: [],
    inputs:['locData']
})

export class DraftHistoryModule{

}
