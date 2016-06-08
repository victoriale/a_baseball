import {Component, Input, OnInit} from 'angular2/core';
import {CircleImage} from '../images/circle-image';
import {CircleImageData} from '../images/image-data';

export interface GameInfoInput{
  inning:string;
  homeData:{
    homeTeamName:string;
    homeImageConfig:CircleImageData;
    homeRecord:string;
    runs:any;
    hits:any;
    errors:any
  };
  awayData:{
    awayTeamName:string;
    awayImageConfig:CircleImageData;
    awayRecord:string;
    runs:any;
    hits:any;
    errors:any
  };
}

@Component({
    selector: 'game-info',
    templateUrl: './app/components/game-info/game-info.component.html',
    directives: [CircleImage],
    providers: [],
})

export class GameInfo implements OnInit{
    @Input() gameInfo:GameInfoInput;
    homeInfo:Object;
    awayInfo:Object;
    constructor() {}

    ngOnInit(){
      this.homeInfo = this.gameInfo.homeData;
      this.awayInfo = this.gameInfo.awayData;
      // console.log("GAMEINFO",this.gameInfo);
    }
}
