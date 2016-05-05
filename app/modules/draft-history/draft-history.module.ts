import {Component} from 'angular2/core';
import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';

@Component({
    selector: 'draft-history',
    templateUrl: './app/modules/draft-history/draft-history.module.html',
    directives: [Tab, Tabs, SliderCarousel, DetailedListItem, ModuleHeader, ModuleFooter],
    providers: [],
    inputs:['locData']
})

export class DraftHistoryModule{
  moduleTitle:string = "Module Title";
  dataDetail: any = [];
  dataDetails: DetailListInput[];
  carouselData: SliderCarouselInput[];
  footerData: Object;
  constructor(){
    this.moduleTitle = "Draft History - [Team Profile]"
    this.detailedData();
    this.carData();
    this.transformDraftHistory();
  }

  transformDraftHistory(){
    var year = 2014;
    for(var y = 0; y <= 3; y++){
      this.dataDetail[y] = [];
      this.dataDetail[y] = {
        year: year+y,
        data:this.dataDetails,
      };
    }
  }

  selectedTab(event){//each time a tab is selected the carousel needs to change accordingly to the correct list being shown
    this.carouselData = this.dataDetail[event-2014]['data'];
  }

  carData(){
    if(typeof this.carouselData == 'undefined' || this.carouselData == null){// test data only
      this.carouselData =[
        {
        index:'1',
        imageConfig: {//interface is found in image-data.ts
            imageClass: "image-121",
            mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<p>View</p><p>Profile</p>",
                imageClass: "border-2"
            },
            subImages: [
                {
                    imageUrl: "./app/public/placeholder-location.jpg",
                    urlRouteArray: ['Disclaimer-page'],
                    hoverText: "<i class='fa fa-mail-forward'></i>",
                    imageClass: "image-40-sub image-round-lower-right"
                },
                {
                    text: "#1",
                    imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
                }
            ],
        },
        description:[
          '<p><b>Profile Name 1</b><p>',
          '<p>[DP1]: <b>[Data Value 1]</b> | [DP 2]: <b>[Data Value 2]</b><p>',
          '<p><b>[Data Value 1]</b><p>',
          '<p>[Data Point 1]<p>',
        ]
      },{
      index:'2',
      imageConfig: {//interface is found in image-data.ts
          imageClass: "image-121",
          mainImage: {
              imageUrl: "./app/public/placeholder-location.jpg",
              urlRouteArray: ['Disclaimer-page'],
              hoverText: "<p>View</p><p>Profile</p>",
              imageClass: "border-2"
          },
          subImages: [
              {
                  imageUrl: "./app/public/placeholder-location.jpg",
                  urlRouteArray: ['Disclaimer-page'],
                  hoverText: "<i class='fa fa-mail-forward'></i>",
                  imageClass: "image-40-sub image-round-lower-right"
              },
              {
                  text: "#2",
                  imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
              }
          ],
      },
      description:[
        '<p><b>Profile Name 2</b><p>',
        '<p>[DP1]: <b>[Data Value 3]</b> | [DP 2]: <b>[Data Value 4]</b><p>',
        '<p><b>[Data Value 2]</b><p>',
        '<p>[Data Point 3]<p>',
      ]
    }];
    }
  }

  detailedData(){
    if(typeof this.dataDetails == 'undefined' || this.dataDetails == null){// test data only
      this.dataDetails =[
        {
        dataPoints:[
          {
            style:'detail-small',
            data:'test',
            value:'testvalue',
            url:['testLink'],
            icon:'fa fa-share'//test remove when done testing
          },
          {
            style:'detail-large',
            data:'[Profile name1]',
            value:'[Data Value 1]',
            url:[''],
            icon:''
          },
          {
            style:'detail-medium',
            data:'[Data Value]: [City], [ST]',
            value:'[Data Description1]',
            url:['testLink'],
            icon:'fa fa-map-marker'
          },
        ],
        imageConfig: {//interface is found in image-data.ts
            imageClass: "image-121",
            mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<p>View</p><p>Profile</p>",
                imageClass: "border-2"
            },
            subImages: [
                {
                    imageUrl: "./app/public/placeholder-location.jpg",
                    urlRouteArray: ['Disclaimer-page'],
                    hoverText: "<i class='fa fa-mail-forward'></i>",
                    imageClass: "image-40-sub image-round-lower-right"
                },
                {
                    text: "#9",
                    imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
                }
            ],
        },
        hasCTA:true,
        ctaDesc:'Want more info about this [profile type]?',
        ctaBtn:'',
        ctaText:'View Profile',
        ctaUrl:[''],
      },{
      dataPoints:[
        {
          style:'detail-small',
          data:'',
          value:'',
        },
        {
          style:'detail-large',
          data:'[Profile name1]',
          value:'[Data Value 1]',
          url:[''],
          icon:''
        },
        {
          style:'detail-medium',
          data:'[Data Value]: [City], [ST]',
          value:'[Data Description1]',
          url:['testLink'],
          icon:'fa fa-map-marker'
        },
      ],
      imageConfig: {//interface is found in image-data.ts
          imageClass: "image-121",
          mainImage: {
              imageUrl: "./app/public/placeholder-location.jpg",
              urlRouteArray: ['Disclaimer-page'],
              hoverText: "<p>View</p><p>Profile</p>",
              imageClass: "border-2"
          },
          subImages: [
              {
                  imageUrl: "./app/public/placeholder-location.jpg",
                  urlRouteArray: ['Disclaimer-page'],
                  hoverText: "<i class='fa fa-mail-forward'></i>",
                  imageClass: "image-40-sub image-round-lower-right"
              },
              {
                  text: "#9",
                  imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
              }
          ],
      },
      hasCTA:true,
      ctaDesc:'Want more info about this [profile type]?',
      ctaBtn:'',
      ctaText:'View Profile',
      ctaUrl:[''],
    }];
      this.footerData = {
        infoDesc:'Want to see everybody involved in this list',
        btn:'',
        text:'VIEW THE LIST',
        url:'',
      }
    }
  }//end of function

}
