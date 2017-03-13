import {Component, Input} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {GlobalSettings} from "../../global/global-settings";
import {SliderButton} from "../../components/buttons/slider/slider.button";
import {CircleImage} from '../../components/images/circle-image';
import {ImageData,CircleImageData} from '../../components/images/image-data';
import {Search, SearchInput} from '../../components/search/search.component';
import {RouteParams, Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {LandingPageService} from '../../services/landing-page';
import {PartnerHomePage} from '../partner-home-page/partner-home-page';
import {SeoService} from '../../seo.service';
export interface homePageData {
  imageData: CircleImageData;
  location: string;
  divisionName: string;
  teamName: string;
}

export interface newsCarouselData {
  newsTitle: string;
  newsSubTitle: string;
  routerInfo: Array<any>;
}

@Component({
    selector: 'home-page',
    templateUrl: './app/webpages/home-page/home-page.page.html',
    directives: [CircleImage, ROUTER_DIRECTIVES, Search, SliderButton, PartnerHomePage],
    providers: [LandingPageService, Title],
})

export class PickTeamPage{
    public teamData: Array<homePageData>;
    public listData: Array<newsCarouselData>;
    public displayData: Object;
    public imgHero1: string = "/app/public/homePage_hero1.png";
    public imgIcon1: string = "/app/public/homePage_icon1.png";
    public imageTile1: string = "/app/public/iphone.png";
    public imageTile2: string = "/app/public/ipad.png";
    public imageTile3: string = "/app/public/MLB_Schedule_Image.jpg";
    public homeHeading1: string = "Stay Loyal to Your Favorite MLB Team";
    public homeSubHeading1: string = "Find the sports information you need to show your loyalty";
    public homeHeading2: string = "PICK YOUR FAVORITE <span class='text-heavy'>MLB TEAM</span>";
    public homeFeaturesTile1: string = "MLB Standings";
    public homeFeaturesTile3: string = "MLB Scores";
    public homeFeaturesTile4: string = "MLB Schedules";
    public homeFeaturesButton1: string = "View MLB Standings";
    public homeFeaturesButton3: string = "View MLB Scores";
    public homeFeaturesButton4: string = "View MLB Schedules";
    public routerInfo1 = ['Standings-page'];
    public buttonFullList: string = "See The Full List";
    public mlb: string = "MLB";
    public mlbTeams: any;
    public counter: number = 0;
    public max:number = 3;
    public searchInput: SearchInput = {
         placeholderText: "Search for a player or team...",
         hasSuggestions: true
     };
    private isHomeRunZone: boolean = false;
    public gridDivCol: string;
    public gridLMain: string;
    public gridFeaturesCol: string;
    public width: number;
    constructor(private _router: Router,
                private _landingPageService: LandingPageService,
                private _title: Title,
                private _seoService: SeoService,
                private _params: RouteParams) {
      _title.setTitle(GlobalSettings.getPageTitle(""));
      this.getData();
      this.getListData();

      GlobalSettings.getPartnerID(_router, partnerID => {
        var partnerHome = GlobalSettings.getHomeInfo().isHome && GlobalSettings.getHomeInfo().isPartner;
        this.isHomeRunZone = partnerHome;
        //This call will remove all meta tags from the head.
        this._seoService.removeMetaTags();
        //create meta description that is below 160 characters otherwise will be truncated
        let metaDesc = GlobalSettings.getPageTitle('Pick a team near you or search for your favorite baseball team or player.', 'Pick A Team');
        let link = window.location.href;
        let image = './app/public/mainLogo.png';
        let title = "Pick A Team";
        this._seoService.setCanonicalLink(this._params.params, this._router);
        this._seoService.setOgTitle(title);
        this._seoService.setOgDesc(metaDesc);
        this._seoService.setOgType('image');
        this._seoService.setOgUrl(link);
        this._seoService.setOgImage(image);
        this._seoService.setTitle(title);
        this._seoService.setMetaDescription(metaDesc);
        this._seoService.setMetaRobots('Index, Follow');
        this._seoService.setIsArticle("false");
        this._seoService.setPageUrl(link);
        this._seoService.setSearchType("pick a team page");
        this._seoService.setCategory("baseball, " + GlobalSettings.getSportLeagueAbbrv());
        this._seoService.setPageTitle(title);
        this._seoService.setImageUrl(image);
        this._seoService.setKeywords("baseball, " + GlobalSettings.getSportLeagueAbbrv());
        this._seoService.setPageDescription(metaDesc);
      });
    }

    getListData(){
      this.listData = [
        {
          newsTitle: "Pitchers with the Most Strikeouts Thrown",
          newsSubTitle: "See which MLB Pitchers are performing at the top of their game",
          routerInfo: ['List-page', {profile:'player', listname: 'pitcher-strikeouts', sort:'asc', conference: 'all', division: 'all', limit: '20', pageNum:'1'} ]
        },
        {
          newsTitle: "Batters With the Most Strikeouts in the MLB",
          newsSubTitle: "See which MLB Batters are performing at the top of their game",
          routerInfo: ['List-page', {profile:'player', listname: 'batter-strikeouts', sort:'asc', conference: 'all', division: 'all', limit: '20', pageNum:'1'} ]
        },
        {
          newsTitle: "Teams with the Most Runs Allowed in the MLB",
          newsSubTitle: "See which MLB Teams are performing at the top of their game",
          routerInfo: ['List-page', {profile:'team', listname: 'pitcher-runs-allowed', sort:'asc', conference: 'all', division: 'all', limit: '20', pageNum:'1'} ]
        },
        {
          newsTitle: "Teams with the Most RBIs in the MLB",
          newsSubTitle: "See which MLB Teams are performing at the top of their game",
          routerInfo: ['List-page', {profile:'team', listname: 'batter-runs-batted-in', sort:'asc', conference: 'all', division: 'all', limit: '20', pageNum:'1'} ]
        }
      ];
      this.changeMain(this.counter);
    }
    left(){
      var counter = this.counter;
      counter--;

      //make a check to see if the array is below 0 change the array to the top level
      if(counter < 0){
        this.counter = (this.max - 1);
      }else{
        this.counter = counter;
      }
      this.changeMain(this.counter);
    }

    right(){
      var counter = this.counter;
      counter++;
      //check to see if the end of the obj array of images has reached the end and will go on the the next obj with new set of array
      if(counter == this.max){
        this.counter = 0;
      }else{
        this.counter = counter;
      }
      this.changeMain(this.counter);
    }

    //this is where the angular2 decides what is the main image
    changeMain(num){
      if ( num < this.listData.length ) {
        this.displayData = this.listData[num];
      }
    }

    getData(){
      this._landingPageService.getLandingPageService()
        .subscribe(data => {
          this.mlbTeams = data.league;
        })
      var sampleImage = "./app/public/placeholder-location.jpg";
    }
}
