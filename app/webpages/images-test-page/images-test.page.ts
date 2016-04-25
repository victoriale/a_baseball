/**
 * Created by Victoria on 4/19/2016.
 */
import {Component} from 'angular2/core';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent} from '../../components/title/title.component';
import {WidgetModule} from "../../modules/widget/widget.module";
import {WebApp} from '../../app-layout/app.layout';
import {CircleImage} from '../../components/images/circle-image';
import {ImageData,CircleImageData} from '../../components/images/image-data';

export interface TestImage {
  imageData: CircleImageData;
  description: string;
} 

@Component({
    selector: 'images-test-page',
    templateUrl: './app/webpages/images-test-page/images-test.page.html',
    directives: [BackTabComponent, TitleComponent, CircleImage],
})

export class ImagesTestPage {
    titleData: {};
    auHeaderTitle: string;
    
    public testImages: Array<TestImage>;

    constructor() {
      this.getData();
    }

    getData(){
      //About us title
      this.titleData = {
          imageURL : '/app/public/mainLogo.png',
          smallText1 : 'Last Updated: Monday, February 26, 2016',
          smallText2 : ' United States of America',
          heading1 : 'Test Page',
          heading2 : '',
          heading3 : 'A test page for designing and viewing CSS styles',
          heading4 : '',
          icon: 'fa fa-map-marker',
          hasHover: false
      };
      
      var sampleImage = "./app/public/placeholder-location.jpg";
      
      this.testImages = [
        {
          description: "Season Stats, Player Career Stats Module, Injury & Suspension Carousel, Standings Carousel, Team Transactions Carousel",
          imageData: {
            imageClass: "image-150",
            mainImage: {
              imageUrl: sampleImage,
              urlRouteArray: ['Disclaimer-page'],
              hoverText: "Sample",
              imageClass: "border-large"
            },
            subImages: [{
              imageUrl: sampleImage,
              hoverText: "sub",
              imageClass: "image-50-sub image-round-lower-right"
            }]
          }
        },
        {
          description: "Team Roster Carousel",
          imageData: {
            imageClass: "image-150",
            mainImage: {
              imageUrl: sampleImage,
              urlRouteArray: ['Disclaimer-page'],
              hoverText: "Sample",
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
                text: "14",
                imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
              }
            ],
          }
        },
        {
          description: "About the League Module",
          imageData: {
            imageClass: "image-150",
            mainImage: {
              imageUrl: sampleImage,
              urlRouteArray: ['Disclaimer-page'],
              hoverText: "<p>View</p><p>Profile</p>",
              imageClass: "border-large"
            }
          }
        },
        {
          description: "Profile Header",
          imageData: {
            imageClass: "image-180",
            mainImage: {
              imageUrl: sampleImage,
              hoverText: "Sample",
              imageClass: "border-large"
            }
          }
        },
        {
          description: "Player Comparision Module",
          imageData: {
            imageClass: "image-180",
            mainImage: {
              imageUrl: sampleImage,
              hoverText: "Sample",
              imageClass: "border-large"
            },
            subImages: [
              {
                imageUrl: sampleImage,
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "sub",
                imageClass: "image-50-sub image-round-lower-right"
              },
              {
                text: "6",
                imageClass: "image-48-rank image-round-upper-left image-round-sub-text"
              }
            ],
          }
        },
        {
          description: "Injury & Suspension Module - list, Team Roster Module - table row",
          imageData: {
            imageClass: "image-48",
            mainImage: {
              imageUrl: sampleImage,
              hoverText: "Sample",
              imageClass: "border-1"
            }
          }
        },
        {
          description: "Team Transactions Page - list",
          imageData: {
            imageClass: "image-50",
            mainImage: {
              imageUrl: sampleImage,
              hoverText: "Sample",
              imageClass: "border-1"
            }
          }
        },
        {
          description: "List of lists Module - small",
          imageData: {
            imageClass: "image-43",
            mainImage: {
              imageUrl: sampleImage,
              hoverText: "Sample",
              imageClass: "border-1"
            }
          }
        },
        {
          description: "Standings Module - table row",
          imageData: {
            imageClass: "image-46",
            mainImage: {
              imageUrl: sampleImage,
              hoverText: "Sample",
              imageClass: "border-2"
            }
          }
        },
        {
          description: "List of lists Module - large",
          imageData: {
            imageClass: "image-121",
            mainImage: {
              imageUrl: sampleImage,
              hoverText: "Sample",
              imageClass: "border-2"
            },
            subImages: [
              {
                text: "6",
                imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
              }
            ],
          }
        }
      ];
    }
}
