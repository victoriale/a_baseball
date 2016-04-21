import {Component, OnInit, Input} from 'angular2/core';

interface DetailListInput {
  dataPoints: Array<Object>;
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
      console.log(this.testData);
    }
}
