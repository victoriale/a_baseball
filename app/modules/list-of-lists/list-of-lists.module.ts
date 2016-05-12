import {Component} from 'angular2/core';
import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter} from "../../components/module-footer/module-footer.component";
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {ListOfListsItem} from "../../components/list-of-lists-item/list-of-lists-item.component";
import {ModuleHeaderData} from "../../components/module-header/module-header.component";

@Component({
    selector: 'list-of-lists',
    templateUrl: './app/modules/list-of-lists/list-of-lists.module.html',
    directives: [ModuleHeader, ModuleFooter, ListOfListsItem],
    inputs:['locData']
})

export class ListOfListsModule{
  moduleHeader: ModuleHeaderData;
  testData: any;
  footerData: Object;

  constructor(){
    this.moduleHeader = {
      moduleTitle: "Top Lists - [Profile Name]",
      hasIcon: false,
      iconClass: "",
    }

    if(typeof this.testData == 'undefined' || this.testData == null){// test data only
      this.testData =[
        {
          url:          "/list/player/batter-home-runs/asc/National",  // API url for list call
          name:         "Batters with the most home runs in the National League",  // Display name of list
          type:         "player",  // team/player/league
          stat:         "batter-home-runs",  // what stat is this a list of (ie: batter-home-runs)
          ordering:     "asc",  // asc/desc
          scope:        "conference",  //
          scopeName:    "National League",
          conference:   "National",
          division:     "all",
          resultCount:  1,
          pageCount:    1,
          rank:         1,
          icon:         'fa fa-share',

          dataPoints: [
            {//interface is found in image-data.ts
              imageClass: "image-121",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<p>View</p><p>Profile</p>",
                imageClass: "border-2"
              },
              subImages: [
                {
                  text: "#1",
                  imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
                }
              ]
            },
            {//interface is found in image-data.ts
              imageClass: "image-43",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-1"
              },
            },
            {//interface is found in image-data.ts
              imageClass: "image-43",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-1"
              },
            },
            {//interface is found in image-data.ts
              imageClass: "image-43",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-1"
              },
            },
            {//interface is found in image-data.ts
              imageClass: "image-43",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-1"
              },
            },
            {//interface is found in image-data.ts
              imageClass: "image-43",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-1"
              },
            }
          ],

          ctaBtn:'',
          ctaText:'View The List',
          ctaUrl:['']
        },
        {
          url:          "/list/player/batter-home-runs/asc/National",  // API url for list call
          name:         "Batters with the most hits in the National League",  // Display name of list
          type:         "player",  // team/player/league
          stat:         "batter-home-runs",  // what stat is this a list of (ie: batter-home-runs)
          ordering:     "asc",  // asc/desc
          scope:        "conference",  //
          scopeName:    "National League",
          conference:   "National",
          division:     "all",
          resultCount:  1,
          pageCount:    1,
          rank:         1,
          icon:         'fa fa-share',

          dataPoints: [
            {//interface is found in image-data.ts
              imageClass: "image-121",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<p>View</p><p>Profile</p>",
                imageClass: "border-2"
              },
              subImages: [
                {
                  text: "#2",
                  imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
                }
              ]
            },
            {//interface is found in image-data.ts
              imageClass: "image-43",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-1"
              },
            },
            {//interface is found in image-data.ts
              imageClass: "image-43",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-1"
              },
            },
            {//interface is found in image-data.ts
              imageClass: "image-43",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-1"
              },
            },
            {//interface is found in image-data.ts
              imageClass: "image-43",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-1"
              },
            },
            {//interface is found in image-data.ts
              imageClass: "image-43",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-1"
              },
            }
          ],

          ctaBtn:'',
          ctaText:'View The List',
          ctaUrl:['']
        },
        {
          url:          "/list/player/batter-home-runs/asc/National",  // API url for list call
          name:         "Batters with the highest RBI in the National League",  // Display name of list
          type:         "player",  // team/player/league
          stat:         "batter-home-runs",  // what stat is this a list of (ie: batter-home-runs)
          ordering:     "asc",  // asc/desc
          scope:        "conference",  //
          scopeName:    "National League",
          conference:   "National",
          division:     "all",
          resultCount:  1,
          pageCount:    1,
          rank:         1,
          icon:         'fa fa-share',

          dataPoints: [
            {//interface is found in image-data.ts
              imageClass: "image-121",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<p>View</p><p>Profile</p>",
                imageClass: "border-2"
              },
              subImages: [
                {
                  text: "#3",
                  imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
                }
              ]
            },
            {//interface is found in image-data.ts
              imageClass: "image-43",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-1"
              },
            },
            {//interface is found in image-data.ts
              imageClass: "image-43",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-1"
              },
            },
            {//interface is found in image-data.ts
              imageClass: "image-43",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-1"
              },
            },
            {//interface is found in image-data.ts
              imageClass: "image-43",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-1"
              },
            },
            {//interface is found in image-data.ts
              imageClass: "image-43",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-1"
              },
            }
          ],

          ctaBtn:'',
          ctaText:'View The List',
          ctaUrl:['']
        },
        {
          url:          "/list/player/batter-home-runs/asc/National",  // API url for list call
          name:         "Batters with the most runs scored in the National League",  // Display name of list
          type:         "player",  // team/player/league
          stat:         "batter-home-runs",  // what stat is this a list of (ie: batter-home-runs)
          ordering:     "asc",  // asc/desc
          scope:        "conference",  //
          scopeName:    "National League",
          conference:   "National",
          division:     "all",
          resultCount:  1,
          pageCount:    1,
          rank:         1,
          icon:         'fa fa-share',

          dataPoints: [
            {//interface is found in image-data.ts
              imageClass: "image-121",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<p>View</p><p>Profile</p>",
                imageClass: "border-2"
              },
              subImages: [
                {
                  text: "#4",
                  imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
                }
              ]
            },
            {//interface is found in image-data.ts
              imageClass: "image-43",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-1"
              },
            },
            {//interface is found in image-data.ts
              imageClass: "image-43",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-1"
              },
            },
            {//interface is found in image-data.ts
              imageClass: "image-43",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-1"
              },
            },
            {//interface is found in image-data.ts
              imageClass: "image-43",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-1"
              },
            },
            {//interface is found in image-data.ts
              imageClass: "image-43",
              mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-1"
              },
            }
          ],

          ctaBtn:'',
          ctaText:'View The List',
          ctaUrl:['']
        }
      ];

      this.footerData = {
        infoDesc:'Want to see more lists like the ones above?',
        btn:'',
        text:'VIEW MORE LISTS',
        url:['Error-page'],//TODO change to proper url
      }
    }

  }
}
