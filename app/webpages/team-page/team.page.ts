import {Component, OnInit} from 'angular2/core';
import {LikeUs} from "../../modules/likeus/likeus.module";
import {DYKModule} from "../../modules/dyk/dyk.module";
import {FAQModule} from "../../modules/faq/faq.module";
import {TwitterModule} from "../../modules/twitter/twitter.module";
import {ComparisonModule} from '../../modules/comparison/comparison.module';

@Component({
    selector: 'Team-page',
    templateUrl: './app/webpages/team-page/team.page.html',
    directives: [DYKModule, FAQModule, LikeUs, TwitterModule, ComparisonModule],
    providers: [],
})

export class TeamPage implements OnInit{

    ngOnInit(){

    }
}
