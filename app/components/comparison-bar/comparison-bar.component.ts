import {Component, Input, OnInit, EventEmitter} from 'angular2/core';

interface ComparisonBarInput {
    data: Array<{
        dataOne: number;
        dataTwo: number;
    }>;
    title: string;
    dataHigh: string;
    colorOne: string;
    colorTwo: string;
    background: string;
}

@Component({
    selector: 'comparison-bar',
    templateUrl: './app/components/comparison-bar/comparison-bar.component.html',
    directives:[],
    providers: []
})

export class ComparisonBar{
    @Input() comparisonBarInput: ComparisonBarInput;
    @Input() dataIndex: number;
    public displayData: any;

    ngOnChanges(event){
        this.configureBar(this.comparisonBarInput);
    }

    //Function to configure any variables the comparison bar needs
    configureBar(data){
        var dataIndex = this.dataIndex;
        var barData = data.data[dataIndex];
        var dataOne = barData.dataOne;
        var dataTwo = barData.dataTwo;
        var dataHigh = data.dataHigh;
        //Determine widths of bars
        data.barOneWidth = Math.round(dataOne / dataHigh * 1000) / 10;
        data.barTwoWidth = Math.round(dataTwo / dataHigh * 1000) / 10;
        //Determine bar data to display
        data.dataOne = dataOne;
        data.dataTwo = dataTwo;
        //Determine which bar is on top
        if(dataOne > dataTwo){
            data.isOneTop = false;
            data.isTwoTop = true;
        }else{
            data.isOneTop = true;
            data.isTwoTop = false;
        }

        this.displayData = data;
    }
}
