import {Component, OnInit} from 'angular2/core';
import {Articles} from "../../../global/global-service";
import {ArticleData} from "../../../global/global-interface";

@Component({
    selector: 'disqus-component',
    templateUrl: './app/components/articles/disqus/disqus.component.html',
    inputs: ["comment"]
})

export class DisqusComponent {
}