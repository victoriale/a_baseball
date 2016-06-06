import {Component, Input, OnInit, OnChanges, ViewChild, AfterViewChecked} from 'angular2/core';
import {NaValuePipe} from '../../pipes/na.pipe';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {ImageData, CircleImageData} from '../images/image-data';
import {CircleImage} from '../images/circle-image';

export interface ComparisonBarInput {
    title: string;
    data: Array<{
        width?: number;
        value: number;
        color: string;
    }>;
    minValue: number;
    maxValue: number;
    info?: string;
    infoBoxDetails?: Array<{
      teamName: string;
      playerName: string;
      infoBoxImage: CircleImageData;
      routerLinkPlayer: any;
      routerLinkTeam: any;
    }>;
}
// export interface InfoBox {
//   teamName: string;
//   playerName: string;
//   infoBoxImage: CircleImageData;
//   routerLinkPlayer: any;
//   routerLinkTeam: any;
// }

@Component({
    selector: 'comparison-bar',
    templateUrl: './app/components/comparison-bar/comparison-bar.component.html',
    directives: [CircleImage, ROUTER_DIRECTIVES],
    pipes: [NaValuePipe],
})

export class ComparisonBar implements OnChanges, AfterViewChecked {
    //Pull in DOM Elements
    @ViewChild('labelOne') labelOne;
    @ViewChild('labelTwo') labelTwo;
    @ViewChild('masterBar') masterBar;

    @Input() comparisonBarInput: ComparisonBarInput;
    @Input() index: number;
    // @Input() infoBox: Array<InfoBox>;
    public displayData: ComparisonBarInput;
    // public infoBoxImage: CircleImageData;
    ngOnChanges(event){
        this.displayData = this.configureBar();
      }//ngOnChanges ends

    //Function to reposition labels if needed
    calculateLabelPositions(){
        if ( this.displayData.data.length < 2 ) {
            return;
        }

        //Get widths of DOM elements
        var barWidth = this.masterBar.nativeElement.offsetWidth;
        var labelOneWidth = this.labelOne.nativeElement.offsetWidth;
        var labelTwoWidth = this.labelTwo.nativeElement.offsetWidth;
        //Calculate final bar widths
        var barOneWidth = barWidth * this.displayData.data[0].width / 100;
        var barTwoWidth = barWidth * this.displayData.data[1].width / 100;
        //Set pixel buffer between labels that are close
        var pixelBuffer = 5;

        var adjustLabel = 0;
        if((Math.abs(barTwoWidth - barOneWidth)) <= (labelTwoWidth + pixelBuffer)){
            //If the difference between the bars is less than the width of the second label, shift label one over
            adjustLabel = Math.ceil(labelTwoWidth - (barTwoWidth - barOneWidth) + pixelBuffer);
        }

        if ( labelOneWidth > barOneWidth ) {
            this.labelOne.nativeElement.style.left = 0;
            if ( adjustLabel > 0 ) {
                this.labelTwo.nativeElement.style.left = adjustLabel + pixelBuffer;
            }
            else {
                this.labelTwo.nativeElement.style.right = 0;
            }
        }
        else {
            this.labelOne.nativeElement.style.right = adjustLabel;
            this.labelTwo.nativeElement.style.right = 0;
        }
    }

    ngAfterViewChecked(){
        this.calculateLabelPositions();
    }

    //Function to configure any variables the comparison bar needs
    configureBar(){
        var barData = this.comparisonBarInput;
        var worstValue = Number(barData.minValue);
        var bestValue = Number(barData.maxValue);
        var adjustedMax = bestValue;
        var switchValues = false;

        // console.log(barData.title);
        // console.log("  worst value is " + worstValue);
        // console.log("  best value is " + bestValue);
        if ( bestValue < worstValue ) {
            adjustedMax = worstValue - bestValue;
            // console.log("  adjusted max value is " + adjustedMax);
            switchValues = true;
        }

        //Determines what percentage the scale starts at (ex. 0 starts at 2% of bars width)
        var scaleStart = 2;
        //Determine widths of bars and add to display list
        for (var i = 0; i < barData.data.length; i++ ) {
            var dataItem = barData.data[i];
            var value = dataItem.value != null ? dataItem.value : 0;
            // console.log("  value: "+ value);
            if ( switchValues ) {
                if ( value < bestValue ) {
                    dataItem.value = null;
                    value = 0;
                }
                else {
                    value = worstValue - value;
                }
                // console.log("  adjusted: " + value);
            }
            dataItem.width = (Math.round(value / adjustedMax * (100 - scaleStart) * 10) / 10) + scaleStart;
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

        return barData;
    }
}
