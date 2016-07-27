import {Component, AfterContentChecked, Input, Output, EventEmitter, ElementRef} from '@angular/core';
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

  @Input('show-item-num') totalItems:number;
  @Input('loop') loop:boolean;
  @Input('fade') fade:boolean;
  @Input('arrow')
  private startIndex:number = 0;
  private endIndex:number = 1;
  private displayedItems:any;

  constructor(private _elRef: ElementRef){

  }
  ngOnInit(){

    //delete below when done testing
    this.data.length = 2;
    console.log(this.data);

    if(this.totalItems == null){// if no input comes from totalItems then default to showing 1 item in carousel
      this.totalItems = 1;
    }
    this.startIndex = 0;//on initial load of component start index at 1
    this.endIndex = (this.startIndex + (this.totalItems-1)) % this.data.length; //the ending index needs to be the start of the index
    this.generateArray();
    if(this.maxLength == null){
      this.maxLength = this.data.length;
    }

  }

  ngAfterViewInit(){
    this.itemSize = this._elRef.nativeElement.getElementsByClassName('carousel_scoll-container')[0].offsetWidth;
  }

  generateArray(){
    var originalData = this.data;
    var total = this.totalItems;
    this.displayedItems = [];
    // this.currentScroll = 0;
    //if loops from input is true then the hidden item needs to be the last item of the array + the prev item before that
    console.log('total',total);
    for(var i = 0; i < total; i++){
      this.displayedItems.push({
        id:i,
        data:originalData[this.startIndex]
      });
      this.startIndex = (this.startIndex + 1) % originalData.length;
      this.endIndex = (this.endIndex + 1) % originalData.length;
      // if( this.startIndex > originalData.length - 1){
      //   this.startIndex = 0;
      // }
      // if( this.endIndex > originalData.length - 1){
      //   this.endIndex = 0;
      // }
    }
    console.log(this.displayedItems);
    for(var o = 1; o < 3; o++){
      //grab the cloned indexes in the array;
      console.log(this.startIndex, this.endIndex);
      var cloneBefore = (this.startIndex - o);
      var cloneAfter = (this.endIndex + o) % originalData.length;
      console.log('indexBefore:', cloneBefore, 'indexAfter:', cloneAfter);
      //sanity check in case there is only 2 items
      if(originalData.length <= 2){
        cloneAfter = cloneAfter > 1 ? cloneAfter : 0;
        cloneBefore = cloneBefore < 0 ? cloneBefore : 0;
      }

      //will get the index of the two previos items but will go back to the top index if it goes below 0
      if(cloneBefore >= 0){
        cloneBefore = cloneBefore % originalData.length;
      }else{
        cloneBefore = originalData.length + cloneBefore;
      }

      //unshift will push the cloned items infront of the array
      this.displayedItems.unshift({
        id:cloneBefore,
        data:originalData[cloneBefore]
      })
      //push will push the cloned items at the end of the array
      this.displayedItems.push({
        id:cloneAfter,
        data:originalData[cloneAfter]
      })
      console.log(cloneBefore,this.displayedItems, cloneAfter);
    }
  }

  checkRightShift(){

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
      console.log(this.rightText);
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
