import {Component, AfterContentChecked, Input, Output, EventEmitter} from '@angular/core';
import {SanitizeStyle, SanitizeHtml} from '../../pipes/safe.pipe';
import {ScheduleBox} from '../schedule-box/schedule-box.component'
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

declare var jQuery:any;

@Component({
    selector: 'side-scroll-test',
    templateUrl: './app/components/side-scroll/side-scroll.component.html',
    directives: [ScheduleBox, ROUTER_DIRECTIVES],
    outputs: ['carouselCount'],
    pipes:[SanitizeStyle, SanitizeHtml]
})

export class SideScroll{
  @Input() maxLength:any;
  @Input() current:any;
  @Input() data: any;
  @Input() carouselData: any;
  public carouselCount = new EventEmitter();
  public currentScroll = 0;
  public rightText:string = '0px';
  private itemSize:number = 205;
  private maxScroll:boolean = false;

  private isMouseDown: boolean = false;
  private drag: number = 0;
  private mouseDown:number = 0;
  private mouseUp:number = 0;
  private boundary:any = {};

  private transition:any = null;

  @Input('total-items') totalItems:number;
  @Input('loop') loop:boolean;


  private startIndex:number = 0;
  private endIndex:number = 1;
  private displayedItems:any;

  constructor(){

  }
  ngOnInit(){
    this.startIndex = 0;
    this.endIndex =this.data.length - 1;
    this.generateArray();
  }

  ngOnChanges(){
  }

  generateArray(){
    var originalData = this.data;
    var total = 7;
    this.displayedItems = [];
    this.currentScroll = 0;
    //if loops from input is true then the hidden item needs to be the last item of the array + the prev item before that
    for(var i = 0; i < 7; i++){
      console.log('i=',i,', start=',this.startIndex);
      this.displayedItems.push({
        id:i,
        data:originalData[this.startIndex]
      });
      console.log(originalData[this.startIndex].date);
      this.startIndex++;
      this.endIndex++;
      if( this.startIndex > originalData.length - 1){
        this.startIndex = 0;
      }
      if( this.endIndex > originalData.length - 1){
        this.endIndex = 0;
      }
    }
    console.log('Displaying',this.displayedItems);
  }

  left(event) {
    this.currentScroll -= this.itemSize;
    if(this.currentScroll <= 0){
      this.currentScroll = 0;
    }
    this.checkCurrent(this.currentScroll);
  }
  right(event) {
    this.maxScroll = !((this.maxLength-1) > Math.round(this.currentScroll/this.itemSize));
    if((this.maxLength-1) > Math.round(this.currentScroll/this.itemSize)){
      this.currentScroll += this.itemSize;
      this.checkCurrent(this.currentScroll);
    }
  }


  scrollX(event){
    let currentClick = event.clientX;
    let mouseType = event.type;
    if(mouseType == 'mousedown'){
      this.mouseDown = event.clientX;
    }
    if(mouseType == 'mouseup'){
      this.mouseUp = event.clientX;
      this.checkCurrent(this.currentScroll);
    }
  }

  movingMouse(event){
    this.isMouseDown = event.buttons === 1;
    this.maxScroll = !((this.maxLength-1) > Math.round(this.currentScroll/this.itemSize));
    if(this.isMouseDown && !this.maxScroll){
      this.drag = (this.mouseDown - event.clientX);
      this.currentScroll += this.drag;
      this.mouseDown = event.clientX;
      if(this.currentScroll <= 0){
        this.currentScroll = 0;
      }
      this.rightText = this.currentScroll+'px';
    }
  }

  checkCurrent(num){
    if(num < 0){
      num = 0;
    }
    let pos = (num / this.itemSize);
    this.currentScroll = Math.round(pos) * this.itemSize;
    this.carouselCount.next(Math.round(pos));
    this.rightText = this.currentScroll+'px';
    this.generateArray();
  }

}
