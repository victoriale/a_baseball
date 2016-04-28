import {Component, OnInit, Input} from 'angular2/core';
import {CircleImage} from '../../components/images/circle-image';
import {CircleImageData} from '../../components/images/image-data';

export interface DetailListInput {
  dataPoints: Array<{
      data: string;
      value: string;
      url?:[any];
      icon?:string;
  }>;
  imageConfig: CircleImageData;
  hasCTA: boolean;
  ctaBtn?: string;//may use another exported interface  that uses all the interfaces below ctaDesc ctaText ctaUrl
  ctaDesc: string;
  ctaText?: string;
  ctaUrl?: [any];
}

@Component({
    selector: 'detailed-list-item',
    templateUrl: './app/components/detailed-list-item/detailed-list-item.html',
    directives: [CircleImage],
    providers: [],
})

export class DetailedListItem implements OnInit{
  @Input() detailedItemData: DetailListInput[];
    ngOnInit(){
      console.log(this.detailedItemData);
    }
}
