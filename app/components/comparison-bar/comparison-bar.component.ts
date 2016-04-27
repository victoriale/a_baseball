import {Component, Input, OnInit, EventEmitter, ViewChild} from 'angular2/core';
declare var jQuery: any;

interface ComparisonBarInput {
    data: Array<{
        dataOne: number;
        dataTwo: number;
        dataHigh: number;
    }>;
    title: string;
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
    //Pull in DOM Elements
    @ViewChild('labelOne') labelOne;
    @ViewChild('labelTwo') labelTwo;
    @ViewChild('masterBar') masterBar;

    @Input() comparisonBarInput: ComparisonBarInput;
    @Input() dataIndex: number;
    public displayData: any;

    ngOnChanges(event){
        this.displayData = this.configureBar(this.comparisonBarInput);
    }

    //Funciton to reposition labels if needed
    calculateLabelPositions(){
        //Get widths of DOM elements
        var barWidth = jQuery(this.masterBar.nativeElement).width();
        var labelOneWidth = jQuery(this.labelOne.nativeElement).width();
        var labelTwoWidth = jQuery(this.labelTwo.nativeElement).width();
        //Calculate final bar widths
        var barOneWidth = barWidth * this.displayData.barOneWidth / 100;
        var barTwoWidth = barWidth * this.displayData.barTwoWidth / 100;
        //Set pixel buffer between labels that are close
        var pixelBuffer = 5;

        if(this.displayData.isOneTop && (Math.abs(barTwoWidth - barOneWidth)) <= labelTwoWidth){
            //If bar one is on top and the difference between the bars is less than the width of label two, shift label one over
            var newRight = Math.ceil(labelTwoWidth - (barTwoWidth - barOneWidth) + pixelBuffer);
        }else{
            //Else right align label one to the right of bar one
            var newRight = 0;
        }
        jQuery(this.labelOne.nativeElement).css('right', newRight);

        if(this.displayData.isTwoTop && (Math.abs(barOneWidth - barTwoWidth)) <= labelOneWidth){
            //If bar two is on top and the difference between the bars is less than the width of label one, shift label two over
            var newRight = Math.ceil(labelOneWidth - (barOneWidth - barTwoWidth) + pixelBuffer);
        }else{
            //Else right align label two to the right of bar two
            var newRight = 0;
        }
        jQuery(this.labelTwo.nativeElement).css('right', newRight);
    }

    ngAfterViewChecked(){
        this.calculateLabelPositions();
    }

    //Function to configure any variables the comparison bar needs
    configureBar(data){
        var dataIndex = this.dataIndex;
        var barData = data.data[dataIndex];
        var dataOne = barData.dataOne;
        var dataTwo = barData.dataTwo;
        var dataHigh = barData.dataHigh;
        //Determines what percentage the scale starts at (ex. 0 starts at 2% of bars width)
        var scaleStart = 2;

        //Determine widths of bars
        data.barOneWidth = (Math.round(dataOne / dataHigh * (100 - scaleStart) * 10) / 10) + scaleStart;
        data.barTwoWidth = (Math.round(dataTwo / dataHigh * (100 - scaleStart) * 10) / 10) + scaleStart;
        //Determine bar data to display
        data.dataOne = dataOne;
        data.dataTwo = dataTwo;
        data.dataHigh = dataHigh;
        //Determine which bar is on top
        if(dataOne > dataTwo){
            data.isOneTop = false;
            data.isTwoTop = true;
        }else{
            data.isOneTop = true;
            data.isTwoTop = false;
        }
        //If the difference between bar one and two is small increase width of one of the bars.
        if(Math.abs(data.barOneWidth - data.barTwoWidth) <= 0.5) {
            if (data.isOneTop === true) {
                //If bar one is on top, add 1% to bar two to increase width
                data.barTwoWidth += 1;
            } else if (data.isTwoTop === true) {
                //If bar two is on top, add 1% to bar one to increase width
                data.barOneWidth += 1;
            }
        }

        return data;
    }
}
