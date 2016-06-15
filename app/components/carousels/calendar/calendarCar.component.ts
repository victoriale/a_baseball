import {Component, OnInit, Output, Input, EventEmitter} from 'angular2/core';
import {BoxScoresService} from '../../../services/box-scores.service';
import {GlobalFunctions} from '../../../global/global-functions';
import {MLBGlobalFunctions} from '../../../global/mlb-global-functions';
import {GlobalSettings} from '../../../global/global-settings';

declare var moment;
export interface CalendarCarouselInput {

}
export interface weekDate {
  unixDate:any;
  active:boolean;
  clickable:boolean;
  year:any;
  month:any;
  day:any;
  weekDay:string;
  ordinal:string;
}

@Component({
    selector: 'calendar-carousel',
    templateUrl: './app/components/carousels/calendar/calendarCar.component.html',
    directives: [],
    providers: [BoxScoresService],
    outputs:['dateEmit'],
})

export class CalendarCarousel implements OnInit{
  @Input() chosenParam:any;
  public curDateView:any;
  public dateEmit: EventEmitter<any> = new EventEmitter();
  public weeklyApi:any;
  public weeklyDates: Array<any>;

  constructor(private _boxScores:BoxScoresService){
  }

  ngOnInit(){
    var params = this.chosenParam;
    this.curDateView = {profile: params.profile, teamId: params.teamId, date: params.date};
    this.callWeeklyApi(this.chosenParam)
    .subscribe( data => {
      this.validateDate(this.chosenParam.date, this.weeklyDates);
    })
  }

  ngOnChanges(){
    if(this.chosenParam != null){
      this.callWeeklyApi(this.chosenParam)
      .subscribe( data => {
        this.validateDate(this.chosenParam.date, this.weeklyDates);
      })
    }
  }

  left(){
    //take parameters and convert using moment to subtract a week from it and recall the week api
    var curParams = this.curDateView;
    console.log("LEFT", this.curDateView);
    curParams.date = moment(curParams.date).subtract(7, 'days').format('YYYY-MM-DD');
    this.callWeeklyApi(curParams).subscribe();
  }

  right(){
    //take parameters and convert using moment to add a week from it and recall the week api
    var curParams = this.curDateView;
    console.log("RIGHT", this.curDateView);
    curParams.date = moment(curParams.date).add(7, 'days').format('YYYY-MM-DD');
    this.callWeeklyApi(curParams).subscribe();
  }

  //whatever is clicked on gets emitted and highlight on the carousel
  setActive(event){
    if(!event.active){//only work if the active && clickable date is not already active
      console.log(event);
      var resetState = this.weeklyDates;
      resetState.forEach(function(val,i){
        val.active = false;
      })
      event.active = true;
      this.chosenParam.date = moment.unix(Number(event.unixDate)/1000).tz('America/New_York').format('YYYY-MM-DD');
      this.dateEmit.next(this.curDateView);
    }
  }

  callWeeklyApi(params){
    return this._boxScores.weekCarousel(params.profile, params.date, params.teamId)
    .map(data=>{
      this.weeklyApi = data.data;
      this.weeklyDates = this.weekFormat(params.date, this.weeklyApi);
      this.validateDate(this.chosenParam.date, this.weeklyDates);
    });
  }

  //week format to grab week call from api and format the data to what is needed for the HTML
  weekFormat(dateChosen, weekData){
    console.log('WEEKLY UNFORMATTED',weekData);
    var formattedArray = [];
    //run through each of the Unix (UTC) dates and convert them to readable EST dates
    for(var date in weekData){
      //convert from UTC TO EST
      let unixSeconds = (Number(date)/1000); //return seconds for moment

      //set each of the dates the EST from UTC and change format to respective format
      let year =  moment.unix(unixSeconds).tz('America/New_York').format('YYYY');
      let month = moment.unix(unixSeconds).tz('America/New_York').format('MMM');
      let day = moment.unix(unixSeconds).tz('America/New_York').format('DD');
      let weekDay = moment.unix(unixSeconds).tz('America/New_York').format('ddd');
      let ordinal = GlobalFunctions.Suffix(Number(day));
      var dateObj:weekDate = {
        unixDate:date,
        active:false,
        clickable:weekData[date],
        year:year,
        month:month,
        day:day,
        weekDay:weekDay,
        ordinal:ordinal,
      }

      //push all dateObj into array
      formattedArray.push(dateObj);
    }
    console.log('WEEKLY FORMATED',formattedArray);

    return formattedArray;
  }

  //validate if the selected date sent in is usable otherwise select nearest previous date
  validateDate(selectedDate, dateArray){// get unix time stamp and grab the earlier played game
    console.log(selectedDate);
    var curUnix = moment(selectedDate,"YYYY-MM-DD").unix();//converts chosen date to unix for comparison
    var validatedDate = curUnix;// will be the closest game to the curdate being sent in default is 0
    var minDateUnix =  Number(dateArray[0].unixDate);
    var maxDateUnix = Number(dateArray[dateArray.length - 1].unixDate);
    var activeIndex;

    dateArray.forEach(function(date, i){
      var dateUnix = Number(date.unixDate)/1000;//converts chosen date to unix (in seconds) for comparison

      //grab highest and lowest number in the array to know the beginning and end of the week
      if((minDateUnix > dateUnix)){//get lowest number in dateArray
        minDateUnix = dateUnix;
      }
      if(dateUnix > maxDateUnix){//get highest number in dateArray
        maxDateUnix = dateUnix;
      }

      //run through the array and set the valid date that has a game as the active key in the dateArray (attached to weeklyDates)
      if( (minDateUnix <= curUnix) && (curUnix <= maxDateUnix) && (validatedDate <= curUnix) && date.clickable){// makes sure to  that the validatedDate does not choose anything higher than selected date
        validatedDate = dateUnix;
        activeIndex = i;//SETS POSITION IN ARRAY THAT CURRENT DATE IS SET TO
      }
    });

    //if a valid active index occurs then set the active date
    if((minDateUnix < curUnix) && (curUnix < maxDateUnix)){
      dateArray[activeIndex].active = true;
    }

    //change validatedDate back into format for dateArray;
    validatedDate = moment.unix(validatedDate).format('YYYY-MM-DD');
    return this.curDateView.date = validatedDate;;//SENDS BACK AS YYYY-MM-DD to use to send back to the box-scores module and set the data
  }
}
