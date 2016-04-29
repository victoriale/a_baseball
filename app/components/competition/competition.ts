import {Component, Input, OnInit} from 'angular2/core';

export interface CompetitionInput{

}

@Component({
    selector: 'competition',
    templateUrl: './app/components/competition/competition.html',

    directives: [],
    providers: [],
})

export class Competition implements OnInit{

    constructor() {}

    ngOnInit(){

    }
}
