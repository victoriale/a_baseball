import {Component, AfterContentChecked, Input, Output, EventEmitter, ElementRef} from '@angular/core';
import {SanitizeStyle, SanitizeHtml} from '../../pipes/safe.pipe';
import {ScheduleBox} from '../schedule-box/schedule-box.component'
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {SanitizeRUrl} from "../../pipes/safe.pipe";
import {GlobalFunctions} from "../../global/global-functions";

declare var jQuery:any;

@Component({
    selector: 'side-scroll-test',
    templateUrl: './app/components/side-scroll/side-scroll.component.html',
    directives: [ScheduleBox, ROUTER_DIRECTIVES],
    outputs: ['carouselCount'],
    pipes:[SanitizeStyle, SanitizeHtml, SanitizeRUrl]
})

export class SideScroll{
  @Input() maxLength:any;
  @Input() current:any;
  @Input() carData: any;
  @Input() videoData: any;
  public carouselCount = new EventEmitter();
  public currentScroll = 0;
  public rightText:string = '0px';
  private itemSize:number = 205;
  private minScroll:boolean = false;
  private maxScroll:boolean = false;
  public numResizes: number = 0;

  private isMouseDown: boolean = false;
  private drag: number = 0;
  private mouseDown:number = 0;
  private mouseUp:number = 0;
  private swipeDirection:string;
  private boundary:any = {};

  private transition:any = '';

  @Input('show-item-num') totalItems:number;
  @Input('loop') loop:boolean;
  @Input('fade') fade:boolean;
  @Input('button-class') buttonClass: string;
  @Input('auto-play') autoPlay:boolean;
  private startIndex:number = 0;
  private endIndex:number = 1;
  private originalData: any;
  private displayedItems:any;
  private currentItem:any;
  private clones:number = 1;
  constructor(private _elRef: ElementRef){

  }
  ngOnInit(){
    var self = this;
    var ssItems = [];

    //push in video items first this can probably handle arguments in future
    var startLength = ssItems.length;
    this.videoData.forEach(function(val, index){
      if(index == 0 && self.autoPlay != null){
        val.videoLink = val.videoLink + "&autoplay=on";
      }
      ssItems.push({
        id: startLength + index,
        data:val,
        type:'video'
      })
    });

    //push in carousels items next this can probably handle arguments in future
    startLength = ssItems.length;
    this.carData.forEach(function(val, index){
      ssItems.push({
        id:startLength + index,
        data:val,
        type:'carousel'
      })
    });

    startLength = ssItems.length; //get total valid items
    for(var c = 1; c <= this.clones; c++){
      //push clones at end of array
      ssItems.unshift({
        id:ssItems[startLength-1].id,
        data:ssItems[startLength-1].data,
        type:ssItems[startLength-1].type
      })
      //unshift pushes clones before array
      ssItems.push({
        id: ssItems[1].id,
        data:ssItems[1].data,
        type:ssItems[1].type
      })
    }

    //set all inputed data into a single originalData variable to be used
    this.originalData = ssItems;

    //delete below when done testing
    // this.carData.length = 2;
    //if loop is not given default to infinite looping
    if(this.loop == null){
      this.loop = true;
    }

    //if no class is set then set to default class of .carousel_scroll-left
    if(this.buttonClass == null){
      this.buttonClass = 'carousel_scroll-button';
    }

    // if no input comes from totalItems then default to showing 1 item in carousel
    if(this.totalItems == null){
      this.totalItems = 1;
    }

    this.startIndex = 0;//on initial load of component start index at 1
    this.endIndex = (this.startIndex + (this.totalItems-1)) % this.originalData.length; //the ending index needs to be the start of the index
    if(this.maxLength == null){
      this.maxLength = this.originalData.length;
    }
    this.generateArray();
  }

  ngAfterViewInit(){
    //make sure to run the element ref after the content has loaded to get the full size;
    this.itemSize = this._elRef.nativeElement.getElementsByClassName('carousel_scroll-container')[0].offsetWidth;
    this.currentScroll = this.itemSize * this.clones;
    this.rightText = this.currentScroll+'px';
    this.currentItem = this.originalData[this.clones];

    //once scrolls are set declare the min and max scrolls if loops is set false
    if(!this.loop){
      this.minScroll = this.currentScroll < this.itemSize * this.clones;
      this.maxScroll = !((this.maxLength) >= Math.round(this.currentScroll/(this.itemSize)));
    }
    this.adjustSizeVideo();
  }

  // ngDoCheck(){
  //   if(this._elRef.nativeElement.getElementsByClassName('carousel_scroll-container').length > 0){
  //     this.itemSize = this._elRef.nativeElement.getElementsByClassName('carousel_scroll-container')[0].offsetWidth;
  //   }
  // }

  onResize(event){
    if(this._elRef.nativeElement.getElementsByClassName('carousel_scroll-container').length > 0 && this.numResizes > 0){
      this.itemSize = this._elRef.nativeElement.getElementsByClassName('carousel_scroll-container')[0].offsetWidth;
      if (this.currentItem.id == "0"){
        this.currentScroll = this.itemSize;
      }
      else {
        this.currentScroll = this.itemSize * (Number(this.currentItem.id) + 1);
        jQuery(".carousel_scroll-item").removeClass("videoActive");
      }
      this.rightText = this.currentScroll+'px';
    }
      this.numResizes = this.numResizes + 1;
  }

  generateArray(){
    var self = this;
    var originalData = this.originalData;
    var total = this.totalItems;
    this.displayedItems = [];
    // this.currentScroll = 0;
    //if loops from input is true then the hidden item needs to be the last item of the array + the prev item before that
    for(var item = 0; item < originalData.length; item++){
      this.displayedItems.push(originalData[item]);
      this.endIndex = originalData[item].id;//set ending index to last item of total items shown
    }

  }
  adjustSizeVideo() {
    if (this.currentItem.type == "video") {
      jQuery(".carousel_scroll-item").addClass("videoActive");
    }
    else {
      jQuery(".carousel_scroll-item").removeClass("videoActive");
    }
  }

  left(event) {
    //moves the current scroll over the item size
    this.currentScroll -= (this.itemSize);
    if(this.currentScroll < 0){
      this.currentScroll = (this.itemSize * this.maxLength-1);
    }
    this.checkCurrent(this.currentScroll);
    this.adjustSizeVideo();
  }
  right(event) {
    this.currentScroll += this.itemSize;
    if(this.maxLength >= Math.round(this.currentScroll/this.itemSize)){
      this.checkCurrent(this.currentScroll);
    }else{
      this.currentScroll = 0;
      this.checkCurrent(this.currentScroll);
    }
    this.adjustSizeVideo();
  }

  //For mobile screen swiping events
  onSwipe(event){
    this.swipeDirection = event.deltaX > 0 ? 'right' : 'left';
    if(this.swipeDirection == 'right'){//this is for quick fix but not final version
      this.left('left');
    }else if (this.swipeDirection == 'left'){
      this.right('right');
    }
    this.checkCurrent(this.currentScroll);
    this.adjustSizeVideo();
  }

  scrollX(event){
    let currentClick = event.clientX;
    let mouseType = event.type;
    if(mouseType == 'mousedown'){
      this.mouseDown = event.clientX;
    }
    if(mouseType == 'mouseup'){
      if(this.drag >= 0){//this is for quick fix but not final version
        this.right('right');
      }else{
        this.left('left');
      }
      this.mouseUp = event.clientX;
      this.checkCurrent(this.currentScroll);
    }
  }

  movingMouse(event){
    //if mouse down set event to true and allow drag
    this.isMouseDown = event.buttons === 1;
    if(!this.loop){
      this.maxScroll = !((this.maxLength-this.clones) > Math.round(this.currentScroll/(this.itemSize)));
    }

    if(this.isMouseDown && !this.maxScroll){

      //if mousedown is detected and not at maxLength then detect distance by pixel of drag and use the correct function right or left
      this.drag = (this.mouseDown - event.clientX);
      this.currentScroll -= this.drag;
      if(this.currentScroll < 0){
        this.currentScroll = (this.maxLength-1) * this.itemSize;
      }else if (this.currentScroll > (this.maxLength-1) * this.itemSize){
        this.currentScroll = 0;
      }
      this.mouseDown = event.clientX;
      this.rightText = this.currentScroll+'px';
      this.checkCurrent(this.currentScroll);
    }
  }

  checkCurrent(currentScroll){
    var self = this;
    //set maxScroll and minScroll if loops is set to false
    if(!this.loop){
      this.minScroll = this.currentScroll < (this.itemSize * this.clones);
      this.maxScroll = !((this.maxLength) > Math.round(this.currentScroll/(this.itemSize)));
    }
    let pos = (currentScroll / this.itemSize);
    //if num which is currentScroll is below the above the clone pos then reset to beginning of array else if current size is below then reset to beginning
    if(pos > this.maxLength){
      currentScroll = 0;
    }else if (pos < 0){
      currentScroll = this.itemSize * (this.maxLength-1);
    }else{
      this.transition = "score-transition2";
    }

    //if pos (position) is between then round to nearest  whole number and move carousel
    this.currentScroll = Math.round(pos) * this.itemSize;
    this.currentItem = this.originalData[(Math.round(pos))];
    this.carouselCount.next(Math.round(pos));
    this.rightText = this.currentScroll+'px';

    //ran after the transition to the clone is made and instant switch to the beginning or end of array with no transition
    setTimeout(function(){
      if(pos <= 0){
        self.transition = "";
        self.currentScroll = (self.maxLength-2) * self.itemSize;
        self.rightText = self.currentScroll+'px';
      }
      if(pos >= self.maxLength - 1){
        self.transition = "";
        self.currentScroll = self.itemSize;
        self.rightText = self.currentScroll+'px';
      }
    },200);
  }

  formatDate(date) {
    return GlobalFunctions.formatGlobalDate(date,'timeZone');
  }

}
