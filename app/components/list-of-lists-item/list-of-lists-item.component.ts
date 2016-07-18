import {Component, OnInit, Input} from '@angular/core';
import {CircleImage} from '../../components/images/circle-image';
import {CircleImageData} from '../../components/images/image-data';
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";
import {ResponsiveWidget} from '../../components/responsive-widget/responsive-widget.component';

export interface IListOfListsItem {
    url:          string;  // API url for list call
    name:         string;  // Display name of list
    type:         string;  // team/player/league
    stat:         string;  // what stat is this a list of (ie: batter-home-runs)
    ordering:     string;  // asc/desc
    scope:        string;  //
    scopeName:    string;
    conference:   string;
    division:     string;
    resultCount:  number;
    pageCount:    number;
    rank:         number;

    dataPoints: Array<{
        imageUrl:   string;
        urlRoute:   [any];
    }>;
}

@Component({
    selector: 'list-of-lists-item',
    templateUrl: './app/components/list-of-lists-item/list-of-lists-item.component.html',
    directives: [CircleImage, ROUTER_DIRECTIVES, ResponsiveWidget],
    providers: [],
})

export class ListOfListsItem{
    // TODO-JVW setup interface for input
    @Input() item: any;
    @Input() rowIndex: number;
}
