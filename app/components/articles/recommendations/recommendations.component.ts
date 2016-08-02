import {Component, Input, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";
import {SanitizeHtml} from "../../../pipes/safe.pipe";


@Component({
    selector: 'recommendations-component',
    templateUrl: './app/components/articles/recommendations/recommendations.component.html',
    directives: [ROUTER_DIRECTIVES],
    pipes: [SanitizeHtml]
})

export class RecommendationsComponent implements OnInit {
    @Input() randomHeadlines:any;
    @Input() images:any;
    @Input() isDeepDive:boolean = false;
    isSmall:boolean = false;

    onResize(event) {
        this.isSmall = event.target.innerWidth <= 639;
    }

    ngOnInit() {
        this.isSmall = window.innerWidth <= 639;
    }
}
