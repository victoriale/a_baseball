import {Component, Input, OnInit} from '@angular/core';
import {NgStyle} from '@angular/common';
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";

@Component({
    selector: 'recommendations-component',
    templateUrl: './app/components/articles/recommendations/recommendations.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [NgStyle],
})

export class RecommendationsComponent{
  @Input() randomHeadlines: any;
  @Input() images: any;
  @Input() isDeepDive: boolean = false;
}
