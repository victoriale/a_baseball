import {Component, Input, OnInit} from 'angular2/core';
import {CircleImage} from '../images/circle-image';
import {CircleImageData} from '../images/image-data';
import {StatHyphenValuePipe} from '../../pipes/stat-hyphen.pipe';

export interface GameInfoInput{
  gameHappened: boolean,
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
    pipes: [StatHyphenValuePipe],
})

export class GameInfo implements OnInit{
    @Input() gameInfo:GameInfoInput;
    homeInfo:Object;
    awayInfo:Object;
    constructor() {
    }

    ngOnInit(){
      this.homeInfo = this.gameInfo.homeData;
      this.awayInfo = this.gameInfo.awayData;
      // console.log("GAMEINFO",this.gameInfo);
    }
    ngOnChanges(){
      console.log('changes',this.gameInfo);
      if(this.gameInfo != null){
        this.homeInfo = this.gameInfo.homeData;
        this.awayInfo = this.gameInfo.awayData;
      }
    }
}
