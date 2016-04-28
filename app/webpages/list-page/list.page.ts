import {Component, OnInit, OnChanges} from 'angular2/core';
import {Router, RouteParams, ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
import {DetailedListItem} from '../../components/detailed-list-item/detailed-list-item';
import {WidgetModule} from "../../modules/widget/widget.module";
import {GlobalFunctions} from "../../global/global-functions";
import {TitleComponent} from '../../components/title/title.component';
import {PaginationFooter} from "../../components/pagination-footer/pagination-footer.component";
import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';
//import {MapComponent} from '../../components/map/map.component';

declare var jQuery: any;
declare var moment: any;
declare var lh: any;

@Component({
    selector: 'List-page',
    templateUrl: './app/webpages/list-page/list.page.html',

    directives: [ROUTER_DIRECTIVES, DetailedListItem, WidgetModule, PaginationFooter, LoadingComponent, ErrorComponent],
    providers: []
})

export class ListPage implements OnInit{
  constructor() {

  }

  ngOnInit() {

  }

}
