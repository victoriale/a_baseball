import {Component} from 'angular2/core';
import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {TitleComponent} from '../../components/title/title.component';
import {BackTabComponent} from '../../components/backtab/backtab.component';

@Component({
    selector: 'list-page',
    templateUrl: './app/webpages/list-page/list.page.html',
    directives: [BackTabComponent, TitleComponent, Tab, Tabs, SliderCarousel, DetailedListItem, ModuleFooter],
    providers: [],
    inputs:[]
})

export class DraftHistoryPage{
  dataDetail: any = [];
  dataDetails: DetailListInput[];
  carouselData: SliderCarouselInput[];
  footerData: Object;
  constructor(){
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
        carData:this.carouselData,
      };
    }
  }

  selectedTab(event){//each time a tab is selected the carousel needs to change accordingly to the correct list being shown
    this.carouselData = this.dataDetail[event-2014]['carData'];
  }

  carData(){
    if(typeof this.carouselData == 'undefined' || this.carouselData == null){// test data only
      this.carouselData =
      [
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
        }
      ];
    }
  }

  detailedData(){
    if(typeof this.dataDetails == 'undefined' || this.dataDetails == null){// test data only
      var dummyImg = "./app/public/placeholder-location.jpg";
      var dummyRoute = ['Disclaimer-page'];
      var dummyRank = '#4';

      var dummyData = {
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
      //imageData(mainImg, mainImgRoute, subImg, subRoute, rank)
      imageConfig: this.imageData(dummyImg,dummyRoute,dummyImg,dummyRoute,dummyRank),
      hasCTA:true,
      ctaDesc:'Want more info about this [profile type]?',
      ctaBtn:'',
      ctaText:'View Profile',
      ctaUrl:[''],
    }
      this.dataDetails =[
      {
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
      //imageData(mainImg, mainImgRoute, subImg, subRoute, rank)
      imageConfig: this.imageData(dummyImg,dummyRoute,dummyImg,dummyRoute,dummyRank),
      hasCTA:true,
      ctaDesc:'Want more info about this [profile type]?',
      ctaBtn:'',
      ctaText:'View Profile',
      ctaUrl:[''],
    }];

    // for(var i = 0; i < 20; i++){
    //     this.dataDetails.push(dummyData);
    // }
    }
  }//end of function

  imageData(mainImg, mainImgRoute, subImg, subRoute, rank){
    if(typeof mainImg =='undefined' || mainImg == ''){
      mainImg = "./app/public/placeholder-location.jpg";
    }
    if(typeof subImg =='undefined' || subImg == ''){
      mainImg = "./app/public/placeholder-location.jpg";
    }
    var image = {//interface is found in image-data.ts
        imageClass: "image-121",
        mainImage: {
            imageUrl: mainImg,
            urlRouteArray: mainImgRoute,
            hoverText: "<p>View</p><p>Profile</p>",
            imageClass: "border-2"
        },
        subImages: [
            {
                imageUrl: subImg,
                urlRouteArray: subRoute,
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "image-40-sub image-round-lower-right"
            },
            {
                text: rank,
                imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
            }
        ],
    }
    return image;
  }
}
