import {Component, Input, OnInit} from '@angular/core';

export interface GameInfoInput{

}

@Component({
    selector: 'game-info',
    templateUrl: './app/components/game-info/game-info.component.html',
    directives: [],
    providers: [],
})

export class GameInfo implements OnInit{

    constructor() {}

    ngOnInit(){

    }
}
