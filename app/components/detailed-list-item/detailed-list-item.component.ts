import {Component, OnInit, Input} from '@angular/core';
import {CircleImage} from '../../components/images/circle-image';
import {CircleImageData} from '../../components/images/image-data';
import {ROUTER_DIRECTIVES} from '@angular/router';

export interface DetailListInput {
  // must have a length of 3 or the styling will be off
  // detail-small will be a small sized texted that are floated left and right of the detailed-list box
  // detail-medium normal size non bolded text that is used for quick description for the large listed item
  // detail-large is the main large font bolded text that should describe what the detailed list should be about

  //within dataPoints the objects are float left => data  and float right => value
  /*
    data-----------value
    data-----------value
    data-----------value
  */
  //as it would appear on the module itself
  dataPoints: Array<{
      style?:string;
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
    templateUrl: './app/components/detailed-list-item/detailed-list-item.component.html',
    directives: [ROUTER_DIRECTIVES, CircleImage],
    providers: [],
})

export class DetailedListItem{
  @Input() detailedItemData: DetailListInput[];
}
