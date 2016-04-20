import {Component} from 'angular2/core';
import {DetailedListItem} from '../../components/detailed-list-item/detailed-list-item';
import {ModuleFooter} from '../../components/module-footer/module-footer';
import {ModuleHeader} from '../../components/module-header/module-header';

interface DraftHistory{

}

@Component({
    selector: 'draft-history',
    templateUrl: './app/modules/draft-history/draft-history.html',
    directives: [DetailedListItem, ModuleHeader, ModuleFooter],
    providers: [],
    inputs:['locData']
})

export class DraftHistoryModule{
  moduleTitle:string = "Module Title";
}
