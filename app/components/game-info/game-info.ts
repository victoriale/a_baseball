import {Component, Input, OnInit} from 'angular2/core';

export interface GameInfoInput{

}

@Component({
    selector: 'game-info',
    templateUrl: './app/components/game-info/game-info.html',
    directives: [],
    providers: [],
})

export class GameInfo implements OnInit{

    constructor() {}

    ngOnInit(){

    }
}
