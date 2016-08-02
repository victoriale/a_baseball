import {Component, Input, OnInit} from '@angular/core';
import {ProfileDataComponent} from "../profileData/profileData.component";
import {BillboardComponent} from "../billboard/billboard.component";
import {SanitizeHtml} from '../../../pipes/safe.pipe';

@Component({
    selector: 'article-content-component',
    templateUrl: './app/components/articles/article-content/article-content.component.html',
    directives: [ProfileDataComponent, BillboardComponent],
    inputs: ["articleData", "articleType", "articleSubType", "imageLinks", "teamId", "partnerId"],
    pipes: [SanitizeHtml]
})

export class ArticleContentComponent implements OnInit{
    isSmall:boolean = false;

    onResize(event) {
        this.isSmall = event.target.innerWidth <= 640;
    }

    ngOnInit() {
        this.isSmall = window.innerWidth <= 640;
    }
}
