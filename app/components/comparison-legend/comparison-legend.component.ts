import {Component, Input, OnChanges, EventEmitter} from 'angular2/core';

interface ComparisonLegendInput {
    legendTitle: string;
    titleOne: string;
    colorOne: string;
    titleTwo: string;
    colorTwo: string;
    titleHigh?: string;
    colorHigh?: string;
}

@Component({
    selector: 'comparison-legend',
    templateUrl: './app/components/comparison-legend/comparison-legend.component.html',
    directives:[],
    providers: []
})

export class ComparisonLegend{
    @Input() comparisonLegendInput: ComparisonLegendInput;

    ngOnInit(){
    }

    ngOnChanges(){
    }
}