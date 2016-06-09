import {Component, Input, OnInit, EventEmitter} from 'angular2/core';
import {StatHyphenValuePipe} from '../../pipes/stat-hyphen.pipe';

export interface ScoreBoardInput{

}

@Component({
    selector: 'score-board',
    templateUrl: './app/components/score-board/score-board.component.html',
    directives: [],
    pipes: [StatHyphenValuePipe],
})

export class ScoreBoard implements OnInit{
  @Input() scoreBoard:any;
  public pixel:number = 27;
  public scrollScore:string;
  public offset:number;

  //css rule to allow transitioning boxes as it moves left and right smoothly
  private transition = `
    -webkit-transition: all 0.5s ease-out;
    -moz-transition: all 0.5s ease-out;
    -ms-transition: all 0.5s ease-out;
    -o-transition: all 0.5s ease-out;
    transition: all 0.5s ease-out;
  `;
  constructor(){

  }

  left(){
    if(this.offset > 0){//do not allow scoreboard to move below the first inning
      this.offset--;
    }
    this.scrollScore = "left:-"+(this.pixel * this.offset)+"px;" + this.transition;
  }
  right(){
    if(this.offset < (this.scoreBoard.scoreArray.length - 9)){//there has to be 9 innings and if there happens to be more allow user to scroll up to that point
      this.offset++;
    }
    this.scrollScore = "left:-"+(this.pixel * this.offset)+"px;" + this.transition;
  }

  ngOnInit(){
    this.offset = 0;//sets the offset to 0
    console.log(this.scoreBoard);
  }
}
