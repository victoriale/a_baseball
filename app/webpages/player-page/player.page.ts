import {Component, OnInit} from 'angular2/core';
import {LikeUs} from "../../modules/likeus/likeus.module";
import {DYKModule} from "../../modules/dyk/dyk.module";
import {FAQModule} from "../../modules/faq/faq.module";
import {TwitterModule} from "../../modules/twitter/twitter.module";
import {ComparisonModule} from '../../modules/comparison/comparison.module';
import {ShareModule} from '../../modules/share/share.module';
import {CommentModule} from '../../modules/comment/comment.module';

import {ShareModuleInput} from '../../modules/share/share.module';
import {HeadlineComponent} from '../../components/headline/headline.component';

import {NewsModule} from '../../modules/news/news.module';
import {SchedulesModule} from '../../modules/schedules/schedules.module';
import {BoxScoresModule} from '../../modules/box-scores/box-scores.module';

@Component({
    selector: 'Player-page',
    templateUrl: './app/webpages/player-page/player.page.html',
    directives: [
          HeadlineComponent,
          CommentModule,
          DYKModule,
          FAQModule,
          LikeUs,
          TwitterModule,
          ComparisonModule,
          ShareModule,
          NewsModule,
          SchedulesModule,
          BoxScoresModule],
    providers: [],
})

export class PlayerPage implements OnInit{
    public shareModuleInput: ShareModuleInput = {
        imageUrl: './app/public/mainLogo.png'
    };

    ngOnInit(){

    }
}
