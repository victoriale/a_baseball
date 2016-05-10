import {Component, OnInit, Input} from 'angular2/core';
import {CircleImage} from '../../components/images/circle-image';
import {CircleImageData} from '../../components/images/image-data';
import {ROUTER_DIRECTIVES} from "angular2/router";

export interface IListOfListItem {
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

        //imageConfig:  CircleImageData;
        //mainImage:    ImageData;
        //urlRouteArray?: Array<any>; //TODO-CJP make not 'any'
        //imageUrl?: string;
        //placeholderImageUrl?: string;
        //hoverText?: string;
        //text?: string;
        //imageClass: string;

        //subImages?:   Array<ImageData>;
        //urlRouteArray?: Array<any>; //TODO-CJP make not 'any'
        //imageUrl?: string;
        //placeholderImageUrl?: string;
        //hoverText?: string;
        //text?: string;
        //imageClass: string;

        //imageClass:   string;
    }>;
}

@Component({
    selector: 'list-of-list-item',
    templateUrl: './app/components/list-of-list-item/list-of-list-item.component.html',
    directives: [CircleImage, ROUTER_DIRECTIVES],
    providers: [],
})

export class ListOfListItem implements OnInit{
    // TODO setup interface for input
    @Input() item: any;
    ngOnChanges(){
    }
    ngOnInit(){}
}
