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
  private minScroll:boolean = false;
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
  @Input('button-class') buttonClass: string;
  private startIndex:number = 0;
  private endIndex:number = 1;
  private displayedItems:any;
  private clones: number = 2;
  constructor(private _elRef: ElementRef){

  }
  ngOnInit(){

    //delete below when done testing
    // this.data.length = 2;

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
    this.endIndex = (this.startIndex + (this.totalItems-1)) % this.data.length; //the ending index needs to be the start of the index
    if(this.maxLength == null){
      this.maxLength = this.data.length;
    }
    this.generateArray();
  }

  ngAfterViewInit(){
    //make sure to run the element ref after the content has loaded to get the full size;
    this.itemSize = this._elRef.nativeElement.getElementsByClassName('carousel_scroll-container')[0].offsetWidth;
    this.currentScroll = (this.itemSize * this.clones);
    this.rightText = this.currentScroll+'px';

    //once scrolls are set declare the min and max scrolls if loops is set false
    if(!this.loop){
      this.minScroll = this.currentScroll < (this.itemSize * this.clones);
      this.maxScroll = !((this.maxLength + 1) >= Math.round(this.currentScroll/(this.itemSize)));
    }
  }

  ngDoCheck(){
    if(this._elRef.nativeElement.getElementsByClassName('carousel_scroll-container').length > 0){
      this.itemSize = this._elRef.nativeElement.getElementsByClassName('carousel_scroll-container')[0].offsetWidth;
    }
  }

  generateArray(){
    var originalData = this.data;
    var total = this.totalItems;
    this.displayedItems = [];
    // this.currentScroll = 0;
    //if loops from input is true then the hidden item needs to be the last item of the array + the prev item before that
    for(var i = 0; i < originalData.length-1; i++){
      this.displayedItems.push({
        id:i,
        data:originalData[this.startIndex]
      });
      this.startIndex = (this.startIndex + 1) % originalData.length;
      this.endIndex = (this.endIndex + 1) % originalData.length;
    }

    //make sure the have the startIndex equal to the first item to display before creating clones
    this.startIndex = this.displayedItems[0].id;
    this.endIndex = this.displayedItems[this.displayedItems.length - 1].id;

    for(var o = 1; o < 3; o++){
      //grab the cloned indexes in the array;
      var cloneBefore = (this.startIndex - o);
      var cloneAfter = (this.endIndex + o);


      //will get the index of the two previos items but will go back to the top index if it goes below 0
      if(cloneBefore >= 0){
        cloneBefore = cloneBefore % originalData.length;
      }else{
        cloneBefore = originalData.length + cloneBefore;
      }

      if(cloneAfter == originalData.length){
        cloneAfter = cloneAfter % originalData.length;
      }

      //unshift will push the cloned items infront of the array
      this.displayedItems.unshift({
        id:this.startIndex - o,
        data:originalData[cloneBefore],
        clone:'clone',
        right: ((this.startIndex - o) * this.itemSize) + 'px'
      })
      //push will push the cloned items at the end of the array
      this.displayedItems.push({
        id:this.endIndex + o,
        data:originalData[cloneAfter],
        clone:'clone',
        right: ((this.startIndex - o) * this.itemSize) + 'px'
      })
    }
  }

  left(event) {
    //moves the current scroll over the item size
    this.currentScroll -= (this.itemSize);
    if(this.currentScroll < (this.itemSize * this.clones)){
      this.currentScroll = (this.itemSize * (this.maxLength + 1));
    }
    this.checkCurrent(this.currentScroll);
  }
  right(event) {
    if(this.maxLength + 1 > Math.round(this.currentScroll/this.itemSize)){
      this.currentScroll += this.itemSize;
      this.checkCurrent(this.currentScroll);
    }else{
      this.currentScroll = (this.itemSize * this.clones);
      this.checkCurrent(this.currentScroll);
    }
  }


  scrollX(event){
    let currentClick = event.clientX;
    let mouseType = event.type;
    if(mouseType == 'mousedown'){
      this.mouseDown = event.clientX;
    }
    if(mouseType == 'mouseup'){//this is for quick fix but not final
      if(this.drag >= 0){
        this.right('swipe right');
      }else{
        this.left('swipe left');
      }
      this.mouseUp = event.clientX;
      this.checkCurrent(this.currentScroll);
    }
  }

  movingMouse(event){
    //if mouse down set event to true and allow drag
    this.isMouseDown = event.buttons === 1;
    if(!this.loop){
      this.maxScroll = !((this.maxLength + 1) > Math.round(this.currentScroll/(this.itemSize)));
    }

    if(this.isMouseDown && !this.maxScroll){

      this.drag = (this.mouseDown - event.clientX);
      console.log(this.mouseDown, event.clientX);
      this.currentScroll -= this.drag;
      console.log(this.drag);
      this.mouseDown = event.clientX;
      if(this.currentScroll < (this.itemSize*this.clones)){
        console.log('reset to :',this.currentScroll);
        this.currentScroll = (this.itemSize * 3);
      }
      this.rightText = this.currentScroll+'px';
      // console.log(this.rightText);
      this.checkCurrent(this.currentScroll);
    }
  }

  checkCurrent(currentScroll){
    //set maxScroll and minScroll if loops is set to false
    if(!this.loop){
      this.minScroll = this.currentScroll < (this.itemSize * this.clones);
      this.maxScroll = !((this.maxLength + 1) > Math.round(this.currentScroll/(this.itemSize)));
    }

    //if num which is currentScroll is below the above the clone pos then reset to beginning of array else if current size is below then reset to beginning
    if(currentScroll > (this.itemSize * (this.maxLength + 1))){
      currentScroll = this.itemSize * this.clones;
    }else if (currentScroll < (this.itemSize * this.clones)){
      currentScroll = this.itemSize * (this.maxLength + 1);
    }

    //if pos (position) is between then round to nearest  whole number and move carousel
    let pos = (currentScroll / this.itemSize);
    this.currentScroll = Math.round(pos) * this.itemSize;
    this.carouselCount.next(Math.round(pos));
    this.rightText = this.currentScroll+'px';
    this.generateArray();
  }

}
