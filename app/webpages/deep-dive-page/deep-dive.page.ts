import {Component, OnInit, Input, NgZone} from '@angular/core';
import {CarouselDiveModule} from '../../modules/carousel-dive/carousel-dive.module';
import {DeepDiveService} from '../../services/deep-dive.service';
import {SidekickWrapper} from '../../components/sidekick-wrapper/sidekick-wrapper.component';
import {SchedulesService} from '../../services/schedules.service';
import {PartnerHeader} from "../../global/global-service";
import {WidgetCarouselModule} from '../../modules/widget/widget-carousel.module';
import {SideScrollSchedule} from '../../modules/side-scroll-schedules/side-scroll-schedules.module';
import {GlobalSettings} from "../../global/global-settings";
import {GlobalFunctions} from "../../global/global-functions";
import {GeoLocation} from "../../global/global-service";
import {Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {ResponsiveWidget} from '../../components/responsive-widget/responsive-widget.component';
import {PartnerHomePage} from '../partner-home-page/partner-home-page';

import {DeepDiveBlock1} from '../../modules/deep-dive-blocks/deep-dive-block-1/deep-dive-block-1.module';
import {DeepDiveBlock2} from '../../modules/deep-dive-blocks/deep-dive-block-2/deep-dive-block-2.module';
import {DeepDiveBlock3} from '../../modules/deep-dive-blocks/deep-dive-block-3/deep-dive-block-3.module';
import {DeepDiveBlock4} from '../../modules/deep-dive-blocks/deep-dive-block-4/deep-dive-block-4.module';

import {SideScroll} from '../../components/side-scroll/side-scroll.component'
//window declarions of global functions from library scripts
declare var moment;
declare var jQuery: any;

@Component({
    selector: 'deep-dive-page',
    templateUrl: './app/webpages/deep-dive-page/deep-dive.page.html',

    directives: [
      PartnerHomePage,
      ROUTER_DIRECTIVES,
      SidekickWrapper,
      WidgetCarouselModule,
      SideScrollSchedule,
      CarouselDiveModule,
      ResponsiveWidget,
      DeepDiveBlock1,
      DeepDiveBlock2,
      DeepDiveBlock3,
      DeepDiveBlock4,
      SideScroll
    ],
    providers: [SchedulesService,DeepDiveService,GeoLocation,PartnerHeader],
})

export class DeepDivePage implements OnInit{
    public widgetPlace: string = "widgetForPage";

    //page variables
    partnerID: string;
    partnerData:any;
    profileName:string;
    geoLocation:string;

    sideScrollData: any;
    scrollLength: number;
    ssMax:number = 9;
    callCount:number = 1;
    callLimit:number = 9;
    safeCall: boolean = true;
    //for carousel
    carouselData: any;
    videoData:any;
    blockIndex: number = 1;
​
    private isHomeRunZone: boolean = false;

    constructor(
      private _router:Router,
      private _deepDiveData: DeepDiveService,
      private _schedulesService:SchedulesService,
      private _geoLocation:GeoLocation,
      private _partnerData: PartnerHeader,
      public ngZone:NgZone){

        // needs to get Geolocation first
      this.profileName = "MLB";

      GlobalSettings.getPartnerID(_router, partnerID => {
          this.partnerID = partnerID;
          var partnerHome = GlobalSettings.getHomeInfo().isHome && GlobalSettings.getHomeInfo().isPartner;
          this.isHomeRunZone = partnerHome;
          if(this.partnerID != null){
            this.getPartnerHeader();
          }else{
            this.getGeoLocation();
          }
      });
    }

    //api for Schedules
    private getSideScroll(){
      let self = this;

      if(this.safeCall){
        this.safeCall = false;
        this._schedulesService.setupSlideScroll(this.sideScrollData, 'league', 'pre-event', this.callLimit, this.callCount, (sideScrollData) => {
          if(this.sideScrollData == null){
            this.sideScrollData = sideScrollData;
          }
          else{
            sideScrollData.forEach(function(val,i){
              self.sideScrollData.push(val);
            })
          }
          this.safeCall = true;
          this.callCount++;
          this.scrollLength = this.sideScrollData.length;
        })
      }
    }

    private scrollCheck(event){
      let maxScroll = this.sideScrollData.length;
      if(event >= (maxScroll - this.ssMax)){
        this.getSideScroll();
      }
    }

    private getDeepDiveVideoBatch(region, numItems, startNum){
        this._deepDiveData.getDeepDiveVideoBatchService(numItems, startNum, region).subscribe(
          data => {
            this.videoData = data.data;
          }
        )
      }

    private getDataCarousel() {
      this._deepDiveData.getCarouselData(this.carouselData, '25', '1', this.geoLocation, (carData)=>{
        this.carouselData = carData;
      })
    }

    getPartnerHeader(){//Since it we are receiving
      if(this.partnerID != null){
        this._partnerData.getPartnerData(this.partnerID)
        .subscribe(
          partnerScript => {
            this.partnerData = partnerScript;
            //super long way from partner script to get location using geo location api
            var state = partnerScript['results']['location']['realestate']['location']['city'][0].state;
            state = state.toLowerCase();
            this.geoLocation = state;
            this.callModules();
          }
        );
      }else{
        this.getGeoLocation();
      }
    }

    //Subscribe to getGeoLocation in geo-location.service.ts. On Success call getNearByCities function.
    getGeoLocation() {
      var defaultState = 'ca';
        this._geoLocation.getGeoLocation()
            .subscribe(
                geoLocationData => {
                  this.geoLocation = geoLocationData[0].state;
                  this.geoLocation = this.geoLocation.toLowerCase();
                  this.callModules();

                },
                err => {
                  this.geoLocation = defaultState;
                  this.callModules();
                }
            );
    }

    callModules(){
      this.getDataCarousel();
      this.getDeepDiveVideoBatch(this.geoLocation, 1, 1);
      this.getSideScroll();
    }
    private onScroll(event) {
      if (jQuery(document).height() - window.innerHeight - jQuery("footer").height() <= jQuery(window).scrollTop()) {
        //fire when scrolled into footer
        this.blockIndex = this.blockIndex + 1;
      }
    }
    ngOnInit(){
      // var script = document.createElement("script");
      // script.src = 'http://content.synapsys.us/deepdive/rails/rails.js?selector=.web-container&adMarginTop=100';
      // document.head.appendChild(script);
      // jQuery("deep-dive-page").parent().addClass('deep-dive-container');
    }
}
