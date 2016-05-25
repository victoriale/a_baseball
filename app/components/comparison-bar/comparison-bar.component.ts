import {Component, Input, OnInit, OnChanges, ViewChild, AfterViewChecked} from 'angular2/core';

//TODO: remove jQuery
declare var jQuery: any;

export interface ComparisonBarInput {
    title: string;
    data: Array<{
        width?: number;
        value: number;
        color: string;
    }>;
    maxValue: number;
}

@Component({
    selector: 'comparison-bar',
    templateUrl: './app/components/comparison-bar/comparison-bar.component.html'
})

export class ComparisonBar implements OnChanges, AfterViewChecked {
    //Pull in DOM Elements
    @ViewChild('labelOne') labelOne;
    @ViewChild('labelTwo') labelTwo;
    @ViewChild('masterBar') masterBar;

    @Input() comparisonBarInput: ComparisonBarInput;
    @Input() index: number;
    
    public displayData: ComparisonBarInput;

    ngOnChanges(event){
        this.displayData = this.configureBar();
    }

    //Function to reposition labels if needed
    calculateLabelPositions(){
        if ( this.displayData.data.length < 2 ) {
            return;
        }
        
        //Get widths of DOM elements
        var barWidth = jQuery(this.masterBar.nativeElement).width();
        var labelOneWidth = jQuery(this.labelOne.nativeElement).width();
        var labelTwoWidth = jQuery(this.labelTwo.nativeElement).width();
        //Calculate final bar widths
        var barOneWidth = barWidth * this.displayData.data[0].width / 100;
        var barTwoWidth = barWidth * this.displayData.data[1].width / 100;
        //Set pixel buffer between labels that are close
        var pixelBuffer = 5;

        if((Math.abs(barTwoWidth - barOneWidth)) <= labelTwoWidth){
            //If the difference between the bars is less than the width of the second label, shift label one over
            var newRight = Math.ceil(labelTwoWidth - (barTwoWidth - barOneWidth) + pixelBuffer);
        }else{
            //Else right align label one to the right of bar one
            var newRight = 0;
        }
        jQuery(this.labelOne.nativeElement).css('right', newRight);

        // if(this.displayData.isTwoTop && (Math.abs(barOneWidth - barTwoWidth)) <= labelOneWidth){
        //     //If bar two is on top and the difference between the bars is less than the width of label one, shift label two over
        //     var newRight = Math.ceil(labelOneWidth - (barOneWidth - barTwoWidth) + pixelBuffer);
        // }else{
        //     //Else right align label two to the right of bar two
        //     var newRight = 0;
        // }
        jQuery(this.labelTwo.nativeElement).css('right', 0);
    }

    ngAfterViewChecked(){
        this.calculateLabelPositions();
    }

    //Function to configure any variables the comparison bar needs
    configureBar(){
        var barData = this.comparisonBarInput;
        var maxValue = barData.maxValue;
        
        //Determines what percentage the scale starts at (ex. 0 starts at 2% of bars width)
        var scaleStart = 2;

        if ( barData.maxValue > 0 ) {
            // console.log("max value: " + barData.maxValue);
        }
        //Determine widths of bars and add to display list
        for (var i = 0; i < barData.data.length; i++ ) {
            var dataItem = barData.data[i];
            dataItem.width = (Math.round(dataItem.value / maxValue * (100 - scaleStart) * 10) / 10) + scaleStart;
            // if ( barData.maxValue > 0 ) {
            //     console.log("data item " + i);
            //     console.log("   value: " + dataItem.value);
            //     console.log("   width: " + dataItem.width);
            //     console.log("   color: " + dataItem.color);
            // }
        }
        barData.data.sort((a,b) => {
            var diff = a.width - b.width;
            if ( Math.abs(diff) <= 0.5 ) {
                if ( diff >= 0 ) {
                    b.width += 1;
                }
                else {
                    a.width += 1;
                }
            }
            return diff;
        });
        //Determine which bar is on top
        // if(dataOne > dataTwo){
        //     data.isOneTop = false;
        //     data.isTwoTop = true;
        // }else{
        //     data.isOneTop = true;
        //     data.isTwoTop = false;
        // }
        //If the difference between bar one and two is small increase width of one of the bars.
        // if(Math.abs(data.barOneWidth - data.barTwoWidth) <= 0.5) {
        //     if (data.isOneTop === true) {
        //         //If bar one is on top, add 1% to bar two to increase width
        //         data.barTwoWidth += 1;
        //     } else if (data.isTwoTop === true) {
        //         //If bar two is on top, add 1% to bar one to increase width
        //         data.barOneWidth += 1;
        //     }
        // }

        return barData;
    }
}
