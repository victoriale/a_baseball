import {Component, OnInit} from 'angular2/core';
import {LikeUs} from "../../modules/likeus/likeus.module";
import {DYKModule} from "../../modules/dyk/dyk.module";

@Component({
    selector: 'Team-page',
    templateUrl: './app/webpages/team-page/team.page.html',
    directives: [DYKModule, LikeUs],
    providers: [],
})

export class TeamPage implements OnInit{

    ngOnInit(){

    }
}
