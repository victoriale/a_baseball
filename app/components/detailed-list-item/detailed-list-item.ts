import {Component, OnInit, Input} from 'angular2/core';

export interface DetailListInput {
  dataPoints: Array<DataValue>; //Array of interface {DataValue}
  dataUrl: string;
  valueUrl: [any];
  imageConf: Object;
  hasCTA: boolean;
  ctaText?: string;
  ctaBtn?: string;
  ctaUrl?: [any];
}

interface DataValue{
  data: string,
  value: string,
  url:[any],
  icon:string,
}

@Component({
    selector: 'detailed-list-item',
    templateUrl: './app/components/detailed-list-item/detailed-list-item.html',
    directives: [],
    providers: [],
})

export class DetailedListItem implements OnInit{
  @Input() testData: DetailListInput;

    ngOnInit(){

    }
}
