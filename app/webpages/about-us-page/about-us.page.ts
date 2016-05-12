/**
 * Created by Victoria on 4/19/2016.
 */
import {Component, OnInit} from 'angular2/core';
import {Router,ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';

import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent} from '../../components/title/title.component';
import {WidgetModule} from "../../modules/widget/widget.module";

import {AboutUsService} from '../../services/about-us.service';
import {GlobalFunctions} from '../../global/global-functions';
import {WebApp} from '../../app-layout/app.layout';
import {TitleInputData} from "../../components/title/title.component";
import {CircleImage} from "../../components/images/circle-image";
import {CircleImageData} from "../../components/images/image-data";

export interface AuBlockData {
  iconUrl?:string;
  link?: {  
    imageConfig: CircleImageData;
    route: Array<any>;
  }  
  titleText:string;
  dataText:string;
}

export interface AboutUsModel {
    blocks: Array<AuBlockData>;
    headerTitle: string;
    titleData: TitleInputData;
    content: Array<string>;
}

@Component({
    selector: 'About-us-page',
    templateUrl: './app/webpages/about-us-page/about-us.page.html',
    directives: [CircleImage, BackTabComponent, TitleComponent, WidgetModule, ROUTER_DIRECTIVES],
    providers: [AboutUsService],
})

export class AboutUsPage {
    public partnerID: string;
    
    public auHeaderTitle: string = "What is the site about?";
    
    public auBlocks: Array<AuBlockData> = [];
    
    public auContent: Array<string> = [];
    
    public content: string;
    
    public titleData: TitleInputData = {
        imageURL : '/app/public/mainLogo.png',
        text1: 'Last Updated: [date]',
        text2: 'United States',
        text3: 'Want to learn more?',
        text4: '',
        icon: 'fa fa-map-marker'
    }

    constructor(private _router: Router, private _service: AboutUsService, private _globalFunctions: GlobalFunctions) {
        this._router.root.subscribe(route => {
          var routeValues = route.split('/');
          this.partnerID = (routeValues[0] == '') ? null : routeValues[0];  


          //TODO-CJP: change to getAboutUsData() when API is ready
          this._service.getData(this.partnerID).subscribe(
            data => this.setupAboutUsData(data),
            err => { 
              console.log("Error getting About Us data: " + err);
            }
          );
        });//end of route subscribe
        
        // Scroll page to top to fix routerLink bug
        window.scrollTo(0, 0);
    }

    setupAboutUsData(data:AboutUsModel) {
      if ( data !== undefined && data !== null ) {
        this.auBlocks = data.blocks;
        this.auHeaderTitle = data.headerTitle;
        this.titleData = data.titleData;
        this.auContent = data.content;
      }
    }
}
