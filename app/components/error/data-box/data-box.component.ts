import {Component,Input} from 'angular2/core';

@Component({
    selector: 'no-data-box',
    templateUrl: './app/components/error/data-box/data-box.component.html',
    directives: [],
    providers: [],
    inputs:[]
})

export class NoDataBox{
  @Input() data: any;
}
