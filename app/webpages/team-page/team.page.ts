import {Component, OnInit} from 'angular2/core';
import {LikeUs} from "../../modules/likeus/likeus.module";

@Component({
    selector: 'Team-page',
    templateUrl: './app/webpages/team-page/team.page.html',
    directives: [LikeUs],
    providers: [],
})

export class TeamPage implements OnInit{

    ngOnInit(){

    }
}
