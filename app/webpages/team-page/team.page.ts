import {Component, OnInit} from 'angular2/core';
import {LikeUs} from "../../modules/likeus/likeus.module";
import {DYKModule} from "../../modules/dyk/dyk.module";
import {FAQModule} from "../../modules/faq/faq.module";
import {TwitterModule} from "../../modules/twitter/twitter.module";
import {ComparisonModule} from '../../modules/comparison/comparison.module';
import {ShareModule} from '../../modules/share/share.module';
import {CommentModule} from '../../modules/comment/comment.module';

import {ShareModuleInput} from '../../modules/share/share.module';

@Component({
    selector: 'Team-page',
    templateUrl: './app/webpages/team-page/team.page.html',
    directives: [CommentModule, DYKModule, FAQModule, LikeUs, TwitterModule, ComparisonModule, ShareModule],
    providers: [],
})

export class TeamPage implements OnInit{
    public shareModuleInput: ShareModuleInput = {
        imageUrl: './app/public/mainLogo.png'
    };

    ngOnInit(){

    }
}
