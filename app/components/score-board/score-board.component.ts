import {Component, Input, OnInit} from 'angular2/core';
export interface ScoreBoardInput{

}

@Component({
    selector: 'score-board',
    templateUrl: './app/components/score-board/score-board.component.html',
    directives: [],
    providers: [],
    inputs:[]
})

export class ScoreBoard implements OnInit{
  @Input() scoreBoard:any;
  constructor(){

  }

  ngOnInit(){
    console.log(this.scoreBoard);
  }
}
