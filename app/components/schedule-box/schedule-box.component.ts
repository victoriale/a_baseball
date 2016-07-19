import {Component, Input, OnInit} from '@angular/core';
import {CircleImageData} from '../images/image-data';
import {CircleImage} from '../images/circle-image';

export interface scheduleBox{
  date:string;
  awayImageConfig:CircleImageData,
  homeImageConfig:CircleImageData,
  awayTeamName:string,
  homeTeamName:string,
  reportDisplay:string,
  reportLink:string,

}

@Component({
    selector: 'schedule-box',
    templateUrl: './app/components/schedule-box/schedule-box.component.html',
    directives: [CircleImage],
    pipes: [],
})

export class ScheduleBox{
  @Input() boxData: scheduleBox;
    constructor() {
    }

    ngOnInit(){
      if(typeof this.boxData == 'undefined'){
        this.boxData = {
          date:"[Month] [DD] [YYYY] <i class='fa fa-circle'></i> [Time PM]",
          awayImageConfig:{//interface is found in image-data.ts
              imageClass: 'imageClass',
              mainImage: {
                  imageUrl: 'mainImg',
                  urlRouteArray: ['mainImgRoute'],
                  hoverText: "<i class='fa fa-mail-forward'></i>",
                  imageClass: 'imageBorder',
              },
          },
          homeImageConfig:{//interface is found in image-data.ts
              imageClass: 'imageClass',
              mainImage: {
                  imageUrl: 'mainImg',
                  urlRouteArray: ['mainImgRoute'],
                  hoverText: "<i class='fa fa-mail-forward'></i>",
                  imageClass: 'imageBorder',
              },
          },
          awayTeamName:'Blue Jays',
          homeTeamName:'Orioles',
          reportDisplay:'Mid Game Report',
          reportLink:'/pick-a-team',
        }
      }
      console.log(this.boxData);
    }
}
