import {Component, OnInit, Input} from 'angular2/core';
import {FooterComponent} from "../../components/footer/footer.component";
import {HeaderComponent} from "../../components/header/header.component";
import {SliderButton} from "../../components/buttons/slider/slider.button";
import {CircleImage} from '../../components/images/circle-image';
import {ImageData,CircleImageData} from '../../components/images/image-data';
import {Search} from '../../components/search/search.component';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

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
    directives: [CircleImage, ROUTER_DIRECTIVES, FooterComponent, HeaderComponent, Search, SliderButton],
    inputs: [],
    providers: [],
})

export class HomePage implements OnInit {
    public teamData: Array<homePageData>;
    public newsData: Array<newsCarouselData>;
    public imgHero1: string = "/app/public/homePage_hero1.png";
    public imgIcon1: string = "/app/public/homePage_icon1.png";
    public imageTile1: string = "/app/public/iphone.png";
    public imageTile2: string = "/app/public/ipad.png";
    public imageTile3: string = "/app/public/MLB_Schedule_Image.jpg";
    public placeholderText: string = "Where do you want to be a fan?";
    public homeHeading1: string = "Stay Loyal to Your Favorite MLB Team";
    public homeHeading2: string = "Find the sports information you need to show your loyalty";
    public homeHeading3: string = "PICK YOUR FAVORITE <b>MLB TEAM</b>";
    public leagueHeading: string;
    public homeFeatures: string;
    public homeFeaturesTile1: string = "<h3>MLB Standings</h3>";
    public homeFeaturesTile2: string = "<h3><b>Dive deep</b></h3> <h4>into key information</h4>";;
    public homeFeaturesTile3: string = "<h3>MLB Scores</h3>";
    public homeFeaturesTile4: string = "<h3>MLB Schedules</h3>";
    public buttonFullList: string = "See The Full List";
    public mlb: string = "MLB";

    constructor(private _router: Router) {
      this.getData();
      this.getNewsData();
    }
    getNewsData(){
      this.newsData = [
        {
          newsTitle: "Top Teams In The League Right Now",
          newsSubTitle: "See which MLB teams are performing at the top of their game",
          routerInfo: ['Disclaimer-page']
        }
      ];
    }
    getData(){
      var sampleImage = "./app/public/placeholder-location.jpg";
      this.leagueHeading = "<b>AMERICAN LEAGUE</b> TEAMS<b>:</b>";
      this.homeFeatures = "<b>Features</b> to Note";
      this.teamData =[
        {
          divisionName: "CENTRAL",
          location: "CHICAGO",
          teamName: "White Sox",
          imageData: {
            imageClass: "image-100",
            mainImage: {
              imageUrl: sampleImage,
              urlRouteArray: ['Disclaimer-page'],
              hoverText: "<i style='font-size:30px;' class='fa fa-mail-forward'></i>",
              imageClass: "border-3"
            }
          }
        },
        {
          divisionName: "EAST",
          location: "ATLANTA",
          teamName: "Braves",
          imageData: {
            imageClass: "image-100",
            mainImage: {
              imageUrl: sampleImage,
              urlRouteArray: ['Disclaimer-page'],
              hoverText: "<i style='font-size:30px;' class='fa fa-mail-forward'></i>",
              imageClass: "border-3"
            }
          }
        },
        {
          divisionName: "WEST",
          location: "ARIZONA",
          teamName: "Diamondbacks",
          imageData: {
            imageClass: "image-100",
            mainImage: {
              imageUrl: sampleImage,
              urlRouteArray: ['Disclaimer-page'],
              hoverText: "<i style='font-size:30px;' class='fa fa-mail-forward'></i>",
              imageClass: "border-3"
            }
          }
        }
      ];

    }
    ngOnInit(){}
}
