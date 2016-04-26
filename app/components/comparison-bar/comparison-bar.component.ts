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
    @ViewChild('labelOne') labelOne;
    @ViewChild('labelTwo') labelTwo;
    @ViewChild('masterBar') masterBar;

    @Input() comparisonBarInput: ComparisonBarInput;
    @Input() dataIndex: number;
    public displayData: any;

    ngOnChanges(event){
        this.displayData = this.configureBar(this.comparisonBarInput);
    }

    calculateLabels(){
        var barWidth = jQuery(this.masterBar.nativeElement).width();
        var labelOneWidth = jQuery(this.labelOne.nativeElement).width();
        var labelTwoWidth = jQuery(this.labelTwo.nativeElement).width();
        var barOneWidth = barWidth * this.displayData.barOneWidth / 100;
        var barTwoWidth = barWidth * this.displayData.barTwoWidth / 100;
        var pixelBuffer = 5;
        console.log('native', this, barWidth, barOneWidth, barTwoWidth, labelOneWidth, labelTwoWidth, this.labelOne.nativeElement.style.width);
        if(this.displayData.isOneTop && (Math.abs(barTwoWidth - barOneWidth)) <= labelTwoWidth){
            var newRight = Math.ceil(labelTwoWidth - (barTwoWidth - barOneWidth) + pixelBuffer);
        }else{
            var newRight = 0;
        }
        jQuery(this.labelOne.nativeElement).css('right', newRight);

        if(this.displayData.isTwoTop && (Math.abs(barOneWidth - barTwoWidth)) <= labelOneWidth){
            var newRight = Math.ceil(labelOneWidth - (barOneWidth - barTwoWidth) + pixelBuffer);
        }else{
            var newRight = 0;
        }
        jQuery(this.labelTwo.nativeElement).css('right', newRight);
        //if(this.displayData.isOneTop && (Math.abs(this.labelTwoRect.right - this.labelOneRect.right)) <= this.labelTwoRect.width){
        //    var newRight = this.labelTwoRect.width - (this.labelTwoRect.right - this.labelOneRect.right) + pixelBuffer;
        //}else{
        //    var newRight = 0;
        //}
        //jQuery(this.labelOne.nativeElement).css('right', newRight);
        //
        //if(this.displayData.isTwoTop && (Math.abs(this.labelOneRect.right - this.labelTwoRect.right)) <= this.labelOneRect.width){
        //    var newRight = this.labelOneRect.width - (this.labelOneRect.right - this.labelTwoRect.right) + pixelBuffer;
        //}else{
        //    var newRight = 0;
        //}
        //jQuery(this.labelTwo.nativeElement).css('right', newRight);
    }

    ngAfterViewChecked(){
        console.log('view checked');
        this.calculateLabels();
    }

    //Function to configure any variables the comparison bar needs
    configureBar(data){
        var dataIndex = this.dataIndex;
        var barData = data.data[dataIndex];
        var dataOne = barData.dataOne;
        var dataTwo = barData.dataTwo;
        var dataHigh = barData.dataHigh;

        //Determine widths of bars
        data.barOneWidth = Math.round(dataOne / dataHigh * 1000) / 10;
        data.barTwoWidth = Math.round(dataTwo / dataHigh * 1000) / 10;
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
