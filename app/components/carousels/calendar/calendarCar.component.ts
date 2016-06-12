import {Component, OnInit, Input} from 'angular2/core';
import {BoxScoresService} from '../../../services/box-scores.service';
export interface CalendarCarouselInput {

}

@Component({
    selector: 'calendar-carousel',
    templateUrl: './app/components/carousels/calendar/calendarCar.component.html',
    directives: [],
    providers: [BoxScoresService],
})

export class CalendarCarousel implements OnInit{
  @Input() chosenParam:any;

  constructor(private _boxScores:BoxScoresService){

  }
    ngOnInit(){
      console.log('chosenParam', this.chosenParam);
      this._boxScores.weekCarousel(this.chosenParam.profile, this.chosenParam.date, this.chosenParam.teamId)
      .subscribe(data=>{
        console.log('DATA!!!!!!!!',data);
      })
    }
}
