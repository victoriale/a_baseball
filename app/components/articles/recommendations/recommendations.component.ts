import {Component, Input} from '@angular/core';
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";

@Component({
    selector: 'recommendations-component',
    templateUrl: './app/components/articles/recommendations/recommendations.component.html',
    directives: [ROUTER_DIRECTIVES],
    inputs: ['randomHeadlines', 'images'],
})

export class RecommendationsComponent {
}