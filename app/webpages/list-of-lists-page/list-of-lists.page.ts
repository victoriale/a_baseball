import {Component, OnInit} from 'angular2/core';
import {RouteParams} from "angular2/router";
import {BackTabComponent} from "../../components/backtab/backtab.component";
import {TitleComponent} from "../../components/title/title.component";
import {contentList} from "../../components/contentlist/contentlist";
import {GlobalFunctions} from "../../global/global-functions";
import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';

@Component({
    selector: 'list-of-lists-page',
    templateUrl: './app/webpages/list-of-lists-page/list-of-lists.page.html',

    directives: [BackTabComponent, TitleComponent, contentList, LoadingComponent, ErrorComponent],
    providers: [],
})

export class ListOfListsPage implements OnInit{


    constructor() {

    }

    ngOnInit(){

    }
}
