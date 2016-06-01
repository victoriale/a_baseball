import {Component, OnInit, Input} from '@angular/core';
import {CircleImage} from '../../components/images/circle-image';
import {CircleImageData} from '../../components/images/image-data';
import {ROUTER_DIRECTIVES} from '@angular/router';

export interface TransactionsListInput {
  // must have a length of 3 or the styling will be off
  // transaction-small will be a small sized texted that are floated left and right of the detailed-list box
  // transaction-medium normal size non bolded text that is used for quick description for the large listed item
  // transaction-large is the main large font bolded text that should describe what the detailed list should be about

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
}

@Component({
    selector: 'transactions-list-item',
    templateUrl: './app/components/transactions-list-item/transactions-list-item.component.html',
    directives: [ROUTER_DIRECTIVES, CircleImage],
    providers: [],
})

export class TransactionsListItem implements OnInit{
  @Input() transactionsItemData: TransactionsListInput[];

    ngOnInit(){

    }
}
