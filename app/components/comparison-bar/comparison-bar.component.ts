import {Component, Input, Output, OnInit, EventEmitter} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
declare var jQuery: any;

@Component({
    selector: 'comparison-bar',
    templateUrl: './app/components/comparison-bar/comparison-bar.component.html',
    directives:[ROUTER_DIRECTIVES],
    providers: []
})

export class ComparisonBar implements OnInit{


    ngOnInit(){
        console.log('Comparison Bar OnInit', this);
    }
}
