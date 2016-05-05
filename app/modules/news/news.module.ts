import {Component, OnInit} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {NewsCarousel, NewsCarouselInput} from '../../components/carousels/news-carousel/news-carousel.component';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';

export interface newModuleData{

}

@Component({
    selector: 'news-module',
    templateUrl: './app/modules/news/news.module.html',
    directives: [ModuleHeader, NewsCarousel, ModuleFooter],
    providers: []
})

export class NewsModule{
    carouselData: NewsCarouselInput[];
    footerData: Object;
    headerInfo: ModuleHeaderData = {
      moduleTitle: "Other Content You Will Love - [Profile Name]",
      hasIcon: false,
      iconClass: "fa fa-heart"
    };
    constructor(){
      this.carData();
      this.getData();
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
    getData(){
      this.footerData = {
        infoDesc:'Want to check out the full story?',
        btn:'',
        text:'READ THE ARTICLE',
        url:'',
      }
    }
}
