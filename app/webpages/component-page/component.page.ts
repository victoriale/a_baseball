import {Component, OnInit} from 'angular2/core';
import {DetailedListItem} from '../../components/detailed-list-item/detailed-list-item';

@Component({
    selector: 'Component-page',
    templateUrl: './app/webpages/component-page/component.page.html',
    directives: [DetailedListItem],
    providers: [],
})

export class ComponentPage implements OnInit{

      ngOnInit(){

      }
}
