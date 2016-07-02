import {Component,Input} from '@angular/core';

@Component({
    selector: 'no-data-box',
    templateUrl: './app/components/error/data-box/data-box.component.html',
    directives: [],
    providers: [],
    inputs:[]
})

export class NoDataBox{
  @Input() data: string;
  @Input() icon: string;
  @Input() class: string;

  constructor(){
    if(typeof this.icon == 'undefined'){
      this.icon = "fa fa-area-chart";
    }
  }
}
