import {Component, Input} from '@angular/core';
import {ProfileDataComponent} from "../profileData/profileData.component";
import {BillboardComponent} from "../billboard/billboard.component";

@Component({
    selector: 'article-content-component',
    templateUrl: './app/components/articles/article-content/article-content.component.html',
    directives: [ProfileDataComponent, BillboardComponent],
    inputs: ["articleData", "articleType", "articleSubType", "imageLinks", "teamId"]
})

export class ArticleContentComponent {
}