import {Component, OnInit, Input} from 'angular2/core';

interface DetailListInput {
  dataPoints: Array<Object>;
  // dataP1:string;
  // dataP2:string;
  // dataP3:string;
  valuePoints:Array<Object>;
  // valueP1:string;
  // valueP2:string;
  // valueP3:string;
  dataUrl: string;
  valueUrl: string;
  imageConf: Object;
  hasCTA: boolean;
  ctaText?: string;
  ctaBtn?: string;
  ctaUrl?: string;
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
      this.testData;
    }
}
