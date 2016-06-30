import {Component, Input} from '@angular/core';

export interface ComparisonLegendInput {
    legendTitle: Array<{
        text: string,
        class?: string
    }>;
    legendValues: Array<{
       title: string,
       color: string 
    }>;
}

@Component({
    selector: 'comparison-legend',
    templateUrl: './app/components/comparison-legend/comparison-legend.component.html'
})

export class ComparisonLegend{
    @Input() comparisonLegendInput: ComparisonLegendInput;
    
    ngOnInit() {
        // if ( this.comparisonLegendInput ) {
        //     this.comparisonLegendInput.legendTitle.forEach(item => {
        //         if ( item.class == )
        //     })
        // }
    }
}