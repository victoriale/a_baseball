/**
 * Created by Victoria on 4/19/2016.
 */
import {Component, OnInit} from 'angular2/core';
import {Router,ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';

import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent} from '../../components/title/title.component';
import {WidgetModule} from "../../modules/widget/widget.module";

import {AboutUsService,AboutUsInterface} from '../../services/about-us.service';
import {GlobalFunctions} from '../../global/global-functions';
import {WebApp} from '../../app-layout/app.layout';
import {TitleInputData} from "../../components/title/title.component";

interface AuBlockData {
  iconUrl:string;
  titleText:string;
  dataText:string;
}

@Component({
    selector: 'Aboutus-page',
    templateUrl: './app/webpages/aboutus-page/aboutus.page.html',

    directives: [ BackTabComponent, TitleComponent, WidgetModule, ROUTER_DIRECTIVES],
    providers: [AboutUsService],
})

export class AboutUsPage {
    public partnerParam: string;
    public partnerID: string;
    public auHeaderTitle = "What is Home Run Loyal?";
    public aboutUsData: AboutUsInterface;
    
    public auBlocks:Array<AuBlockData> = [
      {
        iconUrl: '/app/public/aboutUs_logo1.png',
        titleText: 'MLB Team Profiles',
        dataText: '[##]'
      },
      {
        iconUrl: '/app/public/aboutUs_logo2.png',
        titleText: 'MLB Divisions',
        dataText: '[##]'
      },
      {
        iconUrl: '/app/public/aboutUs_logo3.png',
        titleText: 'MLB Player Profiles',
        dataText: '[##]'
      },
      { //need all three pieces of info from API
        iconUrl: '/app/public/currentWorldSeriesChamp.png', //will need to get the current world series champ from the api
        titleText: '[YYYY] World Series Champions',
        dataText: '[Profile Name]'
      }
    ];
    
    public titleData: TitleInputData = {
        imageURL : '/app/public/mainLogo.png',
        text1: 'Last Updated: Monday, April 25, 2016',
        text2: 'United States',
        text3: (this.partnerID == null) ? "Want to learn more about Home Run Loyal?" : "Want to learn more about My Home Run Loyal?",
        text4: '',
        icon: 'fa fa-map-marker'
    }

    constructor(private _router: Router, private _service: AboutUsService, private _globalFunctions: GlobalFunctions) {
        this._router.root.subscribe(route => {
            var routeValues = route.split('/');
            this.partnerID = (routeValues[0] == '') ? null : routeValues[0];                  
            var pageName = (this.partnerID === null)
              ? "Home Run Loyal" 
              : "My Home Run Loyal";
            this.auHeaderTitle = "What is " + pageName + "?";


            //TODO-CJP: change to getAboutUsData() when API is ready
            this._service.getAboutUsDefaultData().subscribe(
              data => this.setupAboutUsData(data),
              err => { console.log("Error getting About Us data"); }
            );
          })//end of route subscribe
    }

    setupAboutUsData(data:AboutUsInterface) {
        this.aboutUsData = data;
        
        this.auBlocks[0].dataText = this._globalFunctions.commaSeparateNumber(this.aboutUsData.teamProfilesCount);
        
        this.auBlocks[1].dataText = this._globalFunctions.commaSeparateNumber(this.aboutUsData.divisionsCount);
        
        this.auBlocks[2].dataText = this._globalFunctions.commaSeparateNumber(this.aboutUsData.playerProfilesCount);
        
        this.auBlocks[3].iconUrl = this.aboutUsData.worldChampionImageUrl;
        this.auBlocks[3].titleText = this.aboutUsData.worldChampionYear + " World Series Champions";
        this.auBlocks[3].dataText = this.aboutUsData.worldChampionName;
    }
}
