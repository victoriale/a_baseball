import {Component, OnInit} from 'angular2/core';
import {ComparisonBar} from '../../components/comparison-bar/comparison-bar.component';

@Component({
    selector: 'Component-page',
    templateUrl: './app/webpages/component-page/component.page.html',
    directives: [ComparisonBar],
    providers: [],
})

export class ComponentPage implements OnInit{

      ngOnInit(){

      }
}
