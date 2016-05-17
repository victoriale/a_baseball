import {Component, OnInit} from 'angular2/core';

import {AboutUsModule} from '../../modules/about-us/about-us.module';
import {LikeUs} from "../../modules/likeus/likeus.module";
import {DYKModule} from "../../modules/dyk/dyk.module";
import {FAQModule} from "../../modules/faq/faq.module";
import {TwitterModule} from "../../modules/twitter/twitter.module";
import {ComparisonModule} from '../../modules/comparison/comparison.module';
import {ShareModule, ShareModuleInput} from '../../modules/share/share.module';
import {CommentModule} from '../../modules/comment/comment.module';

import {StandingsModule, StandingsModuleData} from '../../modules/standings/standings.module';
import {MLBStandingsTabData} from '../../services/standings.data';
import {StandingsService} from '../../services/standings.service';
import {SchedulesModule} from '../../modules/schedules/schedules.module';
import {BoxScoresModule} from '../../modules/box-scores/box-scores.module';

import {ProfileHeaderData, ProfileHeaderModule} from '../../modules/profile-header/profile-header.module';
import {ProfileHeaderService} from '../../services/profile-header.service';

import {Division, Conference, MLBPageParameters} from '../../global/global-interface';

import {HeadlineComponent} from '../../components/headline/headline.component';

import {NewsModule} from '../../modules/news/news.module';
import {GlobalSettings} from "../../global/global-settings";
import {ImagesService} from "../../services/carousel.service";
import {ImagesMedia} from "../../components/carousels/images-media-carousel/images-media-carousel.component";

@Component({
    selector: 'MLB-page',
    templateUrl: './app/webpages/mlb-page/mlb.page.html',
    directives: [
        SchedulesModule,
        BoxScoresModule,
        HeadlineComponent,
        ProfileHeaderModule,
        StandingsModule,
        CommentModule,
        DYKModule,
        FAQModule,
        LikeUs,
        TwitterModule,
        ComparisonModule,
        ShareModule,
        NewsModule,
        AboutUsModule,
        ImagesMedia],
    providers: [StandingsService, ProfileHeaderService, ImagesService]
})

export class MLBPage implements OnInit {
    public shareModuleInput:ShareModuleInput;

    pageParams:MLBPageParameters = {};

    standingsData:StandingsModuleData;

    profileHeaderData:ProfileHeaderData;

    imageData:any;
    copyright:any;
    profileType:string;
    isProfilePage:boolean = false;
    profileName:string;

    constructor(private _standingsService:StandingsService,
                private _profileService:ProfileHeaderService,
                private _imagesService:ImagesService) {
    }

    ngOnInit() {
        this.setupProfileData();
    }

    private setupProfileData() {
        this._profileService.getMLBProfile().subscribe(
            data => {
                this.profileHeaderData = this._profileService.convertToLeagueProfileHeader(data);
                this.standingsData = this._standingsService.loadAllTabsForModule(this.pageParams);
                this.setupShareModule();
                this.getImages(this.imageData);
            },
            err => {
                console.log("Error getting team profile data for " + this.pageParams.teamId + ": " + err);
            }
        );
    }

    private getImages(imageData) {
        this.isProfilePage = true;
        this.profileType = 'league';
        this.profileName = 'MLB';
        var imageArray = [];
        var copyArray = [];
        this._imagesService.getImages(null, this.profileType)
            .subscribe(data => {
                    imageData = data;
                    imageData.images.forEach(function (val, index) {
                        val['images'] = val.image_url;
                        val['copyright'] = val.image_copyright;
                        imageArray.push(val['images']);
                        copyArray.push(val['copyright'])
                    });
                    return this.imageData = imageArray, this.copyright = copyArray;
                },
                err => {
                    console.log("Error getting image data");
                });
    }

    private standingsTabSelected(tab:MLBStandingsTabData) {
        if (tab && (!tab.sections || tab.sections.length == 0)) {
            this._standingsService.getTabData(tab, this.pageParams, 5)//only show 5 rows in the module
                .subscribe(data => tab.sections = data,
                    err => {
                        console.log("Error getting standings data");
                    });
        }
    }

    private setupShareModule() {
        let profileHeaderData = this.profileHeaderData;
        let imageUrl = typeof profileHeaderData.profileImageUrl === 'undefined' || profileHeaderData.profileImageUrl === null ? GlobalSettings.getImageUrl("/mlb/players/no-image.png") : profileHeaderData.profileImageUrl;
        let shareText = typeof profileHeaderData.profileName === 'undefined' || profileHeaderData.profileName === null ? 'Share This Profile Below' : 'Share ' + profileHeaderData.profileName + '\'s Profile Below:';

        this.shareModuleInput = {
            imageUrl: imageUrl,
            shareText: shareText
        };
    }
}
