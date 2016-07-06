import {Component, Input, OnInit} from '@angular/core';
import {CircleImage} from '../../components/images/circle-image';
import {CircleImageData} from '../../components/images/image-data';

export interface CompetitionInput{
  leftData:string;
  leftValue:string;
  leftCircle:CircleImageData;
  rightData:string;
  rightValue:string;
  rightCircle:CircleImageData;
}

@Component({
    selector: 'competition',
    templateUrl: './app/components/competition/competition.component.html',
    directives: [CircleImage],
    providers: [],
})

export class Competition implements OnInit{
  @Input() competition: CompetitionInput;

    constructor() {

    }

    ngOnInit(){
      if(typeof this.competition == 'undefined'){
        this.competition = {
          leftData:'[Home <b>Team</b>]',
          leftValue:'Record: [##]-[##]',
          leftCircle:{//for left image data
            imageClass: "image-70-sub",
            mainImage: {
              imageUrl: "./app/public/placeholder-location.jpg",
              urlRouteArray: ['Disclaimer-page'],
              hoverText: "<i class='fa fa-mail-forward competition-fa'></i>",
              imageClass: "border-1"
            }
          },
          rightData:'[Away <b>Team</b>]',
          rightValue:'Record: [##]-[##]',
          rightCircle:{//for right image data
            imageClass: "image-70-sub",
            mainImage: {
              imageUrl: "./app/public/placeholder-location.jpg",
              urlRouteArray: ['Disclaimer-page'],
              hoverText: "<i class='fa fa-mail-forward competition-fa'></i>",
              imageClass: "border-1"
            }
          },
        }
      }
    }
}
