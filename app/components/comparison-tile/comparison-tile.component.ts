import {Component, Input, Output, OnInit, EventEmitter} from 'angular2/core';

interface comparisonTileInput {
    dropdownOne: Array<string>;
    dropdownTwo: Array<string>;
    imageConfig: Object;
    title: string;
    lineTwo: string;
    //Currently accepts 4 data points
    data: Array<{
        data: string;
        key: string;
    }>;
}

@Component({
    selector: 'comparison-tile',
    templateUrl: './app/components/comparison-tile/comparison-tile.component.html',
    directives:[],
    providers: []
})

export class ComparisonTile implements OnInit{
    @Input() comparisonTileInput: comparisonTileInput;

    ngOnInit(){
    }
}
