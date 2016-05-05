import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from "angular2/router";

@Component({
    selector: 'recommendations-component',
    templateUrl: './app/components/articles/recommendations/recommendations.component.html',
    directives: [ROUTER_DIRECTIVES],
    inputs: ['randomHeadlines', 'images'],
})

export class RecommendationsComponent {
}