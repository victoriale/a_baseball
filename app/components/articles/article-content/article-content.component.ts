import {Component, Input, OnInit} from '@angular/core';
import {ProfileDataComponent} from "../profileData/profileData.component";
import {BillboardComponent} from "../billboard/billboard.component";
import {SanitizeHtml} from '../../../pipes/safe.pipe';
import {ComplexInnerHtml} from "../../complex-inner-html/complex-inner-html.component";

@Component({
    selector: 'article-content-component',
    templateUrl: './app/components/articles/article-content/article-content.component.html',
    directives: [ProfileDataComponent, BillboardComponent, ComplexInnerHtml],
    pipes: [SanitizeHtml]
})

export class ArticleContentComponent implements OnInit{
    @Input() articleData:any;
    @Input() articleType:any;
    @Input() articleSubType:any;
    @Input() imageLinks:any;
    @Input() partnerId:any;
    @Input() scope:any;
    @Input() teamId:any;
    isSmall:boolean = false;

    onResize(event) {
        this.isSmall = event.target.innerWidth <= 640;
    }

    ngOnInit() {
        this.isSmall = window.innerWidth <= 640;
    }
}
