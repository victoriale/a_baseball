import {Component, Input, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

@Component({
    selector: 'game-article',
    templateUrl: './app/components/game-article/game-article.component.html',
    directives: [ROUTER_DIRECTIVES],
})

export class GameArticle{
    @Input() gameArticle:any;
    constructor() {
    }
}
