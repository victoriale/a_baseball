import {Component} from 'angular2/core';
import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter, ModuleFooterData, FooterStyle} from '../../components/module-footer/module-footer.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {TitleComponent} from '../../components/title/title.component';
import {BackTabComponent} from '../../components/backtab/backtab.component';
@Component({
    selector: 'list-page',
    templateUrl: './app/webpages/list-page/list.page.html',
    directives: [BackTabComponent, TitleComponent, SliderCarousel, DetailedListItem,  ModuleFooter],
    providers: [],
    inputs:[]
})

export class ListPage{
  dataDetail: any = [];
  dataDetails: DetailListInput[];
  carouselData: SliderCarouselInput[];
  footerData: ModuleFooterData;
  footerStyle: FooterStyle;

  constructor(){
    //give style to footerStyle
    this.footerStyle = {
      ctaBoxClass: "list-footer",
      ctaBtnClass:"list-footer-btn",
      hasIcon: true,
    };

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
        ],
        footerInfo: {
          infoDesc:'Want to see everybody involved in this list',
          text:'VIEW THE LIST',
          url:['Disclaimer-page'],
        }
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
          ],
          footerInfo: {
            infoDesc:'Want to see everybody involved in this list',
            text:'VIEW THE LIST',
            url:['Disclaimer-page'],
          }
        }
      ];
    }
  }

  detailedData(){
    if(typeof this.dataDetails == 'undefined' || this.dataDetails == null){// test data only
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
    }
    this.dataDetails = [
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

      for(var i = 0; i < 20; i++){
          this.dataDetails.push(dummyData);
      }
    }
  }//end of function
}
