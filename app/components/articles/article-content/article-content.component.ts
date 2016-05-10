import {Component, Input} from 'angular2/core';
import {ProfileDataComponent} from "../profileData/profileData.component";
import {BillboardComponent} from "../billboard/billboard.component";

@Component({
    selector: 'article-content-component',
    templateUrl: './app/components/articles/article-content/article-content.component.html',
    directives: [ProfileDataComponent, BillboardComponent],
    inputs: ["articleData", "articleType", "articleSubType"]
})

export class ArticleContentComponent {
}