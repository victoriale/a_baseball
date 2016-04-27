import {Component, OnInit, Input} from 'angular2/core';
import {FooterComponent} from "../../components/footer/footer.component";
import {HeaderComponent} from "../../components/header/header.component";
import {CircleImage} from '../../components/images/circle-image';
import {ImageData,CircleImageData} from '../../components/images/image-data';
import {Search} from '../../components/search/search.component';

export interface TestImage {
  imageData: CircleImageData;
  description: string;
}

@Component({
    selector: 'home-page',
    templateUrl: './app/webpages/home-page/home-page.page.html',
    directives: [CircleImage, FooterComponent, HeaderComponent, Search],
    inputs: [],
    providers: [],
})

export class HomePage implements OnInit {
    public teamImages: Array<TestImage>;
    public placeholderText: string;
    constructor() {
      this.getData();
    }
    getData(){
      this.placeholderText = "Where do you want to be a fan?";
      var sampleImage = "./app/public/placeholder-location.jpg";
      this.teamImages =[
        {
          description: "",
          imageData: {
            imageClass: "image-100",
            mainImage: {
              imageUrl: sampleImage,
              urlRouteArray: ['Disclaimer-page'],
              hoverText: "<i class='fa fa-mail-forward'></i>",
              imageClass: "border-3"
            }
          }
        }];

    }
    ngOnInit(){}
}
