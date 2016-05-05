import {Component, OnInit} from 'angular2/core';
import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {TitleComponent} from '../../components/title/title.component';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {DraftHistoryService} from '../../services/draft-history.service';

@Component({
    selector: 'draft-history-page',
    templateUrl: './app/webpages/draft-history-page/draft-history.page.html',
    directives: [BackTabComponent, TitleComponent, Tab, Tabs, SliderCarousel, DetailedListItem, ModuleFooter],
    providers: [DraftHistoryService],
    inputs:[]
})

export class DraftHistoryPage implements OnInit{
  dataArray: any;//array of data for detailed list
  detailedDataArray:any; //variable that is just a list of the detailed DataArray
  carouselDataArray: any;
  footerData: Object;
  footerStyle: any;
  constructor(private draftService:DraftHistoryService){
    this.footerStyle = {
      ctaBoxClass: "list-footer",
      ctaBtnClass:"list-footer-btn",
      hasIcon: true,
    };
  }

  getDraftPage(date) {
      this.draftService.getDraftHistoryService(date)
          .subscribe(
              draftData => {
                if(typeof this.dataArray == 'undefined'){//makes sure it only runs once
                  this.dataArray = draftData.tabArray;
                }
                this.carouselDataArray = draftData.carData
                console.log('CAR ARRAY',this.carouselDataArray);
                this.detailedDataArray = draftData.listData;
                console.log('LIST ARRAY',this.detailedDataArray);
              },
              err => {
                  console.log('Error: draftData API: ', err);
                  // this.isError = true;
              }
          );
  }

  ngOnInit(){
    this.detailedDataArray = this.detailedData();
    //MLB starts and ends in same year so can use current year logic to grab all current season and back 4 years for tabs
    var currentTab = new Date().getFullYear();
    this.getDraftPage(currentTab);
  }

  ngOnChanges(){
    this.detailedDataArray = this.detailedData();
  }

  selectedTab(event){//each time a tab is selected the carousel needs to change accordingly to the correct list being shown
    console.log(event);
    if(event == 'Current Season'){
      event = new Date().getFullYear();
    }
    this.getDraftPage(event);
  }

  carData(){
    var dummyArray = [];
    var dummyImg = "./app/public/placeholder-location.jpg";
    var dummyRoute = ['Disclaimer-page'];
    var dummyRank = '#4';

    if(typeof this.carouselDataArray == 'undefined' || this.carouselDataArray == null){// test data only
      var dummyCarousel = {
        index:'2',
        //imageData(mainImg, mainImgRoute, subImg, subRoute, rank)
        imageConfig: this.imageData("image-150","border-large",dummyImg,dummyRoute,"image-50-sub",dummyImg,dummyRoute,dummyRank),
        description:[
          '<p><b>Profile Name 2</b><p>',
          '<p>[DP1]: <b>[Data Value 3]</b> | [DP 2]: <b>[Data Value 4]</b><p>',
          '<p><b>[Data Value 2]</b><p>',
          '<p>[Data Point 3]<p>',
        ],
        footerInfo: {
          infoDesc:'Want to see everybody involved in this list',
          text:'VIEW THE LIST',
          url:['Disclaimer-page'],
        }
      };

      for(var i = 0; i < 20; i++){
          dummyArray.push(dummyCarousel);
      }
      return dummyArray;
    }
  }



  detailedData(){
    var dummyArray = [];

    var dummyImg = "./app/public/placeholder-location.jpg";
    var dummyRoute = ['Disclaimer-page'];
    var dummyRank = '#4';

    var dummyProfile = "[Profile Name]";
    var dummyProfVal = "[Data Value 1]";
    var dummyProfUrl = ['Disclaimer-page'];
    var dummySubData = "[Data Value]: [City], [ST]";
    var dummySubDesc = "[Data Description]";
    var dummySubUrl = ['Disclaimer-page'];

    var dummyData = {
      dataPoints: this.detailsData(dummyProfile,dummyProfVal,dummyProfUrl,dummySubData,dummySubDesc,dummySubUrl),
      //detailsData(mainP1,mainV1,subP1,subV2,subUrl2,dataP3?,dataV3?,dataUrl3?)
      imageConfig: this.imageData("image-121","border-2",
      dummyImg,dummyRoute,"image-40-sub",dummyImg,dummyRoute,dummyRank),
      hasCTA:true,
      ctaDesc:'Want more info about this [profile type]?',
      ctaBtn:'',
      ctaText:'View Profile',
      ctaUrl:['Disclaimer-page']
    };
    for(var i = 0; i < 20; i++){
        dummyArray.push(dummyData);
    }
    return dummyArray;
  }//end of function

  //this function will have inputs of all required fields that are dynamic and output the full
  imageData(imageClass, imageBorder, mainImg, mainImgRoute, subImgClass?, subImg?, subRoute?, rank?){
    if(typeof mainImg =='undefined' || mainImg == ''){
      mainImg = "./app/public/placeholder-location.jpg";
    }
    if(typeof subImg =='undefined' || subImg == ''){
      mainImg = "./app/public/placeholder-location.jpg";
    }
    var image = {//interface is found in image-data.ts
        imageClass: imageClass,
        mainImage: {
            imageUrl: mainImg,
            urlRouteArray: mainImgRoute,
            hoverText: "<p>View</p><p>Profile</p>",
            imageClass: imageBorder
        },
        subImages: [
            {
                imageUrl: subImg,
                urlRouteArray: subRoute,
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: subImgClass + " image-round-lower-right"
            },
            {
                text: rank,
                imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
            }
        ],
    };
    return image;
  }


  detailsData(mainP1,mainV1,mainUrl1,subP1,subV2,subUrl2,dataP3?,dataV3?,dataUrl3?){
    if(typeof dataP3 == 'undefined'){
      dataP3 = '';
    }
    if(typeof dataV3 == 'undefined'){
      dataV3 = '';
    }

    var details = [
      {
        style:'detail-small',
        data:dataP3,
        value:dataV3,
        url:dataUrl3,
      },
      {
        style:'detail-large',
        data:mainP1,
        value:mainV1,
        url:mainUrl1,
      },
      {
        style:'detail-medium',
        data:subP1,
        value:subV2,
        url:subUrl2,
        icon:'fa fa-map-marker',
      },
    ];
    return details
  }

}
