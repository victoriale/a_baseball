import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {MLBPageParameters} from '../../global/global-interface';

import {AboutUsModule} from '../../modules/about-us/about-us.module';
import {LikeUs} from "../../modules/likeus/likeus.module";
import {DYKModule} from "../../modules/dyk/dyk.module";
import {FAQModule} from "../../modules/faq/faq.module";
import {TwitterModule} from "../../modules/twitter/twitter.module";
import {ComparisonModule} from '../../modules/comparison/comparison.module';
import {CommentModule} from '../../modules/comment/comment.module';

import {StandingsModule, StandingsModuleData} from '../../modules/standings/standings.module';
import {MLBStandingsTabData} from '../../services/standings.data';
import {StandingsService} from '../../services/standings.service';

import {ProfileHeaderData, ProfileHeaderModule} from '../../modules/profile-header/profile-header.module';
import {ProfileHeaderService} from '../../services/profile-header.service';

import {ShareModule, ShareModuleInput} from '../../modules/share/share.module';

import {HeadlineComponent} from '../../components/headline/headline.component';

import {NewsModule} from '../../modules/news/news.module';
import {SchedulesModule} from '../../modules/schedules/schedules.module';
import {BoxScoresModule} from '../../modules/box-scores/box-scores.module';
import {GlobalSettings} from "../../global/global-settings";
import {ImagesService} from "../../services/carousel.service";
import {ImagesMedia} from "../../components/carousels/images-media-carousel/images-media-carousel.component";
import {GlobalFunctions} from "../../global/global-functions";

@Component({
    selector: 'Player-page',
    templateUrl: './app/webpages/player-page/player.page.html',
    directives: [
        SchedulesModule,
        BoxScoresModule,
        ProfileHeaderModule,
        StandingsModule,
        HeadlineComponent,
        CommentModule,
        DYKModule,
        FAQModule,
        LikeUs,
        TwitterModule,
        ComparisonModule,
        NewsModule,
        ShareModule,
        AboutUsModule,
        ImagesMedia],
    providers: [StandingsService, ProfileHeaderService, ImagesService],
})

export class PlayerPage implements OnInit {
    public shareModuleInput:ShareModuleInput;

    pageParams:MLBPageParameters;

    standingsData:StandingsModuleData;

    profileHeaderData:ProfileHeaderData;

    imageData:any;
    copyright:any;
    profileType:string;
    isProfilePage:boolean = false;
    profileName:string;

    constructor(private _params:RouteParams,
                private _standingsService:StandingsService,
                private _profileService:ProfileHeaderService,
                private _imagesService:ImagesService,
                private _globalFunctions:GlobalFunctions) {

        this.pageParams = {
            playerId: Number(_params.get("playerId")),
            playerName: String(_params.get("fullName"))
        };
    }

    ngOnInit() {
        this.setupPlayerProfileData();
    }

    private setupPlayerProfileData() {
        this._profileService.getPlayerProfile(this.pageParams.playerId).subscribe(
            data => {
                this.pageParams = data.pageParams;
                this.profileHeaderData = this._profileService.convertToPlayerProfileHeader(data);
                this.setupTeamProfileData();
                this.setupShareModule();
                this.getImages(this.imageData);
            },
            err => {
                console.log("Error getting player profile data for " + this.pageParams.playerId + ": " + err);
            }
        );
    }

    private getImages(imageData) {
        this.isProfilePage = true;
        this.profileType = 'player';
        let name = this.pageParams.playerName.replace(/-/g, " ");
        this.profileName = this._globalFunctions.toTitleCase(name);
        var imageArray = [];
        var copyArray = [];
        this._imagesService.getImages(this.pageParams.playerId, this.profileType)
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
                    console.log("Error getting image data" + err);
                });
    }

    //This gets team-specific data such as
    // conference and division
    private setupTeamProfileData() {
        this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
            data => {
                this.standingsData = this._standingsService.loadAllTabsForModule(data.pageParams);
            },
            err => {
                console.log("Error getting player profile data for " + this.pageParams.playerId + ": " + err);
            }
        );
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
        let imageUrl = typeof profileHeaderData.profileImageUrl === 'undefined' || profileHeaderData.profileImageUrl === null ? GlobalSettings.getImageUrl('/mlb/players/no-image.png') : profileHeaderData.profileImageUrl;
        let shareText = typeof profileHeaderData.profileName === 'undefined' || profileHeaderData.profileName === null ? 'Share This Profile Below' : 'Share ' + profileHeaderData.profileName + '\'s Profile Below:';

        this.shareModuleInput = {
            imageUrl: imageUrl,
            shareText: shareText
        };
    }
}
