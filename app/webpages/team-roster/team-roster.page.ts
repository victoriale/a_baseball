import {Component, OnInit} from 'angular2/core';
import {Router,ROUTER_DIRECTIVES} from 'angular2/router';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent} from '../../components/title/title.component';
import {TitleInputData} from "../../components/title/title.component";
import {CircleImage} from '../../components/images/circle-image';
import {ImageData,CircleImageData} from '../../components/images/image-data';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {SliderCarousel} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {CustomTable} from '../../components/custom-table/custom-table.component';
import {TableColumn, TableRow, TableCell} from '../../components/custom-table/table-data.component';

@Component({
    selector: 'Teamroster-page',
    templateUrl: './app/webpages/team-roster/team-roster.page.html',

    directives: [BackTabComponent, TitleComponent, CircleImage, Tabs, Tab, SliderCarousel, CustomTable, ROUTER_DIRECTIVES],
    providers: [],
})

export class TeamrosterPage implements OnInit{
  titleData: TitleInputData;
  public carouselData: Array<any>;

  constructor() {
    this.getData();
    this.carData();
  }
  getData(){
    this.titleData = {
        imageURL : '/app/public/mainLogo.png',
        text1: 'Last Updated: Monday, March 21, 2016',
        text2: ' United States of America',
        text3: 'Team Roster - [Team Name]',
        text4: '',
        icon: 'fa fa-map-marker',
        hasHover: false
    };

  }
  carData(){
    //Carousel Data Below is an array of dummy carouselData that should be replaced with real data
    var sampleImage = "./app/public/placeholder-location.jpg";
    var carouselData =[
      {
        imageConfig: {
          imageClass: "image-150",
          mainImage: {
            imageUrl: sampleImage,
            urlRouteArray: ['Disclaimer-page'],
            hoverText: "<p>View</p>Profile",
            imageClass: "border-large"
          },
          subImages: [
            {
              imageUrl: sampleImage,
              urlRouteArray: ['Disclaimer-page'],
              hoverText: "<i class='fa fa-mail-forward'></i>",
              imageClass: "image-50-sub image-round-lower-right"
            },
            {
              text: "#1",
              imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
            }
          ],
        },
        description: [
          "<p>Line4</p>",
          "<p>Line7</p>",
          "<p>Line8</p>",
          "<p>Line3</p>",
        ],
      },
      {
        imageConfig: {
          imageClass: "image-150",
          mainImage: {
            imageUrl: sampleImage,
            urlRouteArray: ['Disclaimer-page'],
            hoverText: "<p>View</p>Profile",
            imageClass: "border-large"
          },
          subImages: [
            {
              imageUrl: sampleImage,
              urlRouteArray: ['Disclaimer-page'],
              hoverText: "<i class='fa fa-mail-forward'></i>",
              imageClass: "image-50-sub image-round-lower-right"
            },
            {
              text: "#1",
              imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
            }
          ],
        },
        description: [
          "<p>Line1</p>",
          "<p>Line2</p>",
          "<p>Line3</p>",
          "<p>Line4</p>",
        ],
      },]
    this.carouselData = carouselData;
  }
  ngOnInit(){}
}
