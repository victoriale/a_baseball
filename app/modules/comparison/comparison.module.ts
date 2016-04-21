import {Component, Input, Output, OnInit, EventEmitter} from 'angular2/core';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {ComparisonTile} from '../../components/comparison-tile/comparison-tile.component';
import {ComparisonBar} from '../../components/comparison-bar/comparison-bar.component'

@Component({
    selector: 'comparison-module',
    templateUrl: './app/modules/comparison/comparison.module.html',
    directives:[ModuleHeader, ComparisonTile, ComparisonBar],
    providers: []
})

export class ComparisonModule implements OnInit{
    public moduleTitle: string = 'Comparison vs. Competition - [Batter Name]';
    public barData: Array<Object> = [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {}
    ];

    ngOnInit(){

    }
}
