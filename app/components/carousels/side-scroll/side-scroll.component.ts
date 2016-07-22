import {Component, AfterContentChecked, Input, Output, EventEmitter} from '@angular/core';
import {SanitizeStyle} from '../../../pipes/safe.pipe';

declare var jQuery:any
;
@Component({
    selector: 'side-scroll',
    templateUrl: './app/components/carousels/side-scroll/side-scroll.component.html',
    outputs: ['carouselCount'],
    pipes:[SanitizeStyle]
})

export class SideScroll{
  @Input() maxLength:any;
  @Input() current:any;
  @Input() data: any;
  public carouselCount = new EventEmitter();
  public currentScroll = 0;
  public rightText:string = '0px';
  private itemSize:number = 205;
  private maxScroll:number =205;

  private isMouseDown: boolean = false;

  constructor(){

  }

  scrollX(event){
    let currentClick = event.clientX;
    console.log('scrollX',event);
    if (this.isMouseDown) {
        console.log(currentClick);
    }
  }

  movingMouse(event){
    console.log('movingMouse',event);
    this.isMouseDown = event.buttons === 1;
  }

  counter(event){
  }

  ngOnInit(){
    this.maxScroll = (this.maxLength-1) * this.itemSize;
  }
  ngOnChanges(){
  }

  left(event) {
    console.log('left');
    this.currentScroll -= this.itemSize;
    if(this.currentScroll <= 0){
      this.currentScroll = 0;
    }
    this.rightText = this.currentScroll+'px';
  }
  right(event) {
    console.log('right');
    this.currentScroll += this.itemSize;
    this.rightText = this.currentScroll+'px';
  }

}
