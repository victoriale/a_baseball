import {Component, Input, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'game-article',
    templateUrl: './app/components/game-article/game-article.component.html',
    directives: [ROUTER_DIRECTIVES],
})

export class GameArticle implements OnInit{
    @Input() gameArticle:any;
    constructor() {
    }

    ngOnInit(){
    }
}
