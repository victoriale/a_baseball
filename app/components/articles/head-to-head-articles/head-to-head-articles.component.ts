import {Component, Input}  from "angular2/core";
import {ROUTER_DIRECTIVES} from "angular2/router";

@Component({
    selector: 'article-head-to-head-component',
    templateUrl: './app/components/articles/head-to-head-articles/head-to-head-articles.component.html',
    directives: [ROUTER_DIRECTIVES],
    inputs: ['randomHeadToHead', 'league', 'arrLength'],
})

export class HeadToHeadComponent {
}