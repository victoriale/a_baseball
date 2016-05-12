import {Component, OnInit, Input} from 'angular2/core';

import {SliderButton} from "../../components/buttons/slider/slider.button";
import {CircleImage} from '../../components/images/circle-image';
import {ImageData,CircleImageData} from '../../components/images/image-data';
import {Search, SearchInput} from '../../components/search/search.component';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {LandingPageService} from '../../services/landing-page';

export interface homePageData {
  imageData: CircleImageData;
  location: string;
  divisionName: string;
  teamName: string;
}
export interface newsCarouselData{

}

@Component({
    selector: 'home-page',
    templateUrl: './app/webpages/home-page/home-page.page.html',
    directives: [CircleImage, ROUTER_DIRECTIVES, Search, SliderButton],
    inputs: [],
    providers: [LandingPageService],
})

export class HomePage implements OnInit {
    public teamData: Array<homePageData>;
    public listData: Array<newsCarouselData>;
    public displayData: Object;
    public imgHero1: string = "/app/public/homePage_hero1.png";
    public imgIcon1: string = "/app/public/homePage_icon1.png";
    public imageTile1: string = "/app/public/iphone.png";
    public imageTile2: string = "/app/public/ipad.png";
    public imageTile3: string = "/app/public/MLB_Schedule_Image.jpg";
    public searchInput: SearchInput = {
        placeholderText: "Where do you want to be a fan?",
        hasSuggestions: true
    };
    public homeHeading1: string = "Stay Loyal to Your Favorite MLB Team";
    public homeHeading2: string = "Find the sports information you need to show your loyalty";
    public homeHeading3: string = "PICK YOUR FAVORITE <b>MLB TEAM</b>";
    public leagueHeading: string;
    public homeFeatures: string;
    public homeFeaturesTile1: string = "MLB Standings";
    public homeFeaturesTile3: string = "MLB Scores";
    public homeFeaturesTile4: string = "MLB Schedules";
    public homeFeaturesButton1: string = "View MLB Standings";
    public homeFeaturesButton3: string = "View MLB Scores";
    public homeFeaturesButton4: string = "View MLB Schedules";
    public buttonFullList: string = "See The Full List";
    public mlb: string = "MLB";
    public mlbTeams: any;
    public counter: number = 0;
    public max:number = 3;

    constructor(private _router: Router, private _landingPageService: LandingPageService) {
      this.getData();
      this.getListData();
    }
    getListData(){
      this.listData = [
        {
          newsTitle: "Top Teams In The League Right Now",
          newsSubTitle: "See which MLB teams are performing at the top of their game",
          routerInfo: ['Disclaimer-page']//TODO
        },
        {
          newsTitle: "Top Pitchers In The League Right Now",
          newsSubTitle: "See which MLB Player are performing at the top of their game",
          routerInfo: ['Disclaimer-page']
        },
        {
          newsTitle: "Players with the Most Home Runs",
          newsSubTitle: "See which MLB Players are performing at the top of their game",
          routerInfo: ['Disclaimer-page']
        },
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
          // console.log(data);
          this.mlbTeams = data.league;
          // console.log(this.mlbTeams);
        })
      var sampleImage = "./app/public/placeholder-location.jpg";
      this.leagueHeading = "<b>AMERICAN LEAGUE</b> TEAMS<b>:</b>";
      this.homeFeatures = "<b>Features</b> to Note";
    }
    ngOnInit(){}
}
