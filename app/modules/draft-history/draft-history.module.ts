import {Component} from 'angular2/core';
import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter} from '../../components/module-footer/module-footer';
import {ModuleHeader} from '../../components/module-header/module-header.component';

@Component({
    selector: 'draft-history',
    templateUrl: './app/modules/draft-history/draft-history.module.html',
    directives: [DetailedListItem, ModuleHeader, ModuleFooter],
    providers: [],
    inputs:['locData']
})

export class DraftHistoryModule{
  moduleTitle:string = "Module Title";
  testData: DetailListInput[];
  footerData: Object;
  constructor(){

    if(typeof this.testData == 'undefined' || this.testData == null){// test data only
      this.testData =[
        {
        dataPoints:[
          {
            data:'test',
            value:'testvalue',
            url:['testLink'],
            icon:'fa fa-share'//test remove when done testing
          },
          {
            data:'[Profile name1]',
            value:'[Data Value 1]',
            url:[''],
            icon:''
          },
          {
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

    // console.log('draft-history test',this.testData);
  }
}
