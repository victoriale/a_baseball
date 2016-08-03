import {Component, OnInit, Output, Input, EventEmitter} from '@angular/core';
import {BoxScoresService} from '../../../services/box-scores.service';
import {GlobalFunctions} from '../../../global/global-functions';
import {MLBGlobalFunctions} from '../../../global/mlb-global-functions';
import {GlobalSettings} from '../../../global/global-settings';

import {DatePicker} from '../../date-picker/date-picker.component';
import {FORM_DIRECTIVES} from '@angular/common';

declare var moment;

class Test {
  date: string;
}

export interface weekDate {
  unixDate:any;
  fullDate:string;
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
    directives: [DatePicker, FORM_DIRECTIVES],
    providers: [BoxScoresService],
})

export class CalendarCarousel implements OnInit{
  @Input() chosenParam:any;
  @Output() dateEmit = new EventEmitter();
  public curDateView:any;
  public weeklyApi:any;
  public weeklyDates: Array<any>;
  public failSafe: number = 0;
  public windowWidth: number = 10;

  constructor(private _boxScores:BoxScoresService){
  }
  //datepicker that chooses the monthly calendar and update all the necessary functions for the rest of the components
  datePicker(event){
    this.chosenParam.date = moment(event).tz('America/New_York').format('YYYY-MM-DD');
    this.callWeeklyApi(this.chosenParam)
    .subscribe( data => {
      this.validateDate(this.chosenParam.date, this.weeklyDates);
    })
    this.dateEmit.next(this.chosenParam);//sends through output so date can be used outside of component
  }
  ngOnInit(){
    this.windowWidth = window.innerWidth;
    //on load grab the input chosenParam and set new variable for currently viewing dates that is used for any changes without changing initial input while it goes through validation
    var params = this.chosenParam;
    this.curDateView = {profile: params.profile, teamId: params.teamId, date: params.date};
    //make call to week api to grab to see if any games are available (true/false)
    this.callWeeklyApi(this.chosenParam)
    .subscribe( data => {
      //then run through validation and set firstRun? option parameter to true
      //validateDate(selectedDate, dateArray, firstRun?)
      this.validateDate(this.chosenParam.date, this.weeklyDates, true);
    })
  }
  private onWindowLoadOrResize(event) {
    this.windowWidth = event.target.innerWidth;
  }

  ngOnChanges(){
    //any changes made to the input from outside will cause the fuction to rerun
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
    curParams.date = moment(curParams.date).subtract(7, 'days').format('YYYY-MM-DD');
    this.callWeeklyApi(curParams).subscribe(data=>{this.validateDate(this.chosenParam.date, this.weeklyDates)});
    this.curDateView.date = curParams.date;//resets current date to the new parameter so that all functions are updated with new date
  }

  right(){
    //take parameters and convert using moment to add a week from it and recall the week api
    var curParams = this.curDateView;
    curParams.date = moment(curParams.date).add(7, 'days').format('YYYY-MM-DD');
    this.callWeeklyApi(curParams).subscribe(data=>{this.validateDate(this.chosenParam.date, this.weeklyDates)});
    this.curDateView.date = curParams.date;//resets current date to the new parameter so that all functions are updated with new date
  }

  leftDay(){
    //take parameters and convert using moment to subtract a week from it and recall the week api
    var curParams = this.curDateView;
    curParams.date = moment(curParams.date).subtract(1, 'days').format('YYYY-MM-DD');
    var dayNum = moment(curParams.date).format('d');
    this.callWeeklyApi(curParams).subscribe(data=>{
      this.validateDate(this.chosenParam.date, this.weeklyDates);
      this.curDateView.date = curParams.date;//resets current date to the new parameter so that all functions are updated with new date
      this.setActive(this.weeklyDates[dayNum]);
    });
  }

  rightDay(){
    //take parameters and convert using moment to add a week from it and recall the week api
    var curParams = this.curDateView;
    curParams.date = moment(curParams.date).add(1, 'days').format('YYYY-MM-DD');
    var dayNum = moment(curParams.date).format('d');
    this.callWeeklyApi(curParams).subscribe(data=>{
      this.validateDate(this.chosenParam.date, this.weeklyDates);
      this.curDateView.date = curParams.date;//resets current date to the new parameter so that all functions are updated with new date
      this.setActive(this.weeklyDates[dayNum]);
    });
  }

  //whatever is clicked on gets emitted and highlight on the carousel
  setActive(event){
    if(!event.active){//only work if the active && clickable date is not already active
      var resetState = this.weeklyDates;
      resetState.forEach(function(val,i){
        val.active = false;
      })
      event.active = true;
      this.chosenParam.date = event.fullDate;
      this.dateEmit.next(this.chosenParam);//sends through output so date can be used outside of component
    }
  }

  //makes weekly api call and sets reactive variables
  callWeeklyApi(params){
    // this.weeklyApi = null;// resets call to load loading Gif as it waits for data
    return this._boxScores.weekCarousel(params.profile, params.date, params.teamId)
    .map(data=>{
      this.weeklyApi = data.data;
      this.weeklyDates = this.weekFormat(params.date, this.weeklyApi);
    });
  }

  //week format to grab week call from api and format the data to what is needed for the HTML
  weekFormat(dateChosen, weekData){
    var formattedArray = [];
    //run through each of the Unix (UTC) dates and convert them to readable EST dates
    for(var date in weekData){

      //set each of the dates the EST from UTC and change format to respective format
      let year =  moment(Number(date)).tz('America/New_York').format('YYYY');
      let month = moment(Number(date)).tz('America/New_York').format('MMM');
      let day = moment(Number(date)).tz('America/New_York').format('D');
      let weekDay = moment(Number(date)).tz('America/New_York').format('ddd');
      let fullDate = moment(Number(date)).tz('America/New_York').format('YYYY-MM-DD');
      let ordinal = GlobalFunctions.Suffix(Number(day));
      var dateObj:weekDate = {
        unixDate:date,
        fullDate:fullDate,
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
    return formattedArray;
  }

  /**
    *validateDate(selectedDate, dateArray, firstRun?)
    *selectedDate => date that is being sent into function
    *dateArray => Array of dates to check with selected date and validate selected date
    *firstRun (optional) => to run a different part of the function to determine if validatedDate function will run recursively or not
    *
    *curUnix => //converts chosen date to unix for comparison
    *validatedDate => will be the closest game to the curdate being sent in default is 0
    *minDateUnix => // sets the minimum date in unix of the current Array being sent back
    *maxDateUnix => // sets the max date in unix of the current Array being sent back
    *activeIndex => // if there is a validated date then grab the index or position of that date in the current array;
    *mostRecent => // used mainly for first run. but if the chosent parameters on initial load does not match anything then this variable will grab the next most previous game that has happened.
    *
    */
  validateDate(selectedDate, dateArray, firstRun?){
    var curUnix = moment(selectedDate,"YYYY-MM-DD").unix()*1000;
    var validatedDate = 0;
    var minDateUnix =  Number(dateArray[0].unixDate);
    var maxDateUnix = Number(dateArray[dateArray.length - 1].unixDate);
    var activeIndex;
    var mostRecent;
    dateArray.forEach(function(date, i){
      var dateUnix = Number(date.unixDate);//converts chosen date to unix (in seconds) for comparison
      var dateTime = moment(dateUnix).tz('America/New_York').format('YYYY-MM-DD');
      //grab highest and lowest number in the array to know the beginning and end of the week
      if((minDateUnix > dateUnix)){//get lowest number in dateArray
        minDateUnix = dateUnix;
      }else if(dateUnix > maxDateUnix){//get highest number in dateArray
        maxDateUnix = dateUnix;
      }

      //FIRST RUN
      if(firstRun != null){
        if( (selectedDate == date.fullDate) && date.clickable){
          validatedDate = dateUnix;
          activeIndex = i;//SETS POSITION IN ARRAY THAT CURRENT DATE IS SET TO if the curUnix date exists within the current dateArray
        }else{
          //sets most recent game before the curUnix date and index if they havent been found, while the validatedDate and clickability still hasn't been found
          if( ((mostRecent < date.unixDate && date.unixDate <= curUnix) && activeIndex == null) || (date.unixDate <= curUnix && date.clickable && validatedDate == 0)){
            mostRecent = date.unixDate;
            activeIndex = i;
          }
        }
      }else{//NOT FIRST RUN
        //run through the array and set the valid date that has a game as the active key in the dateArray (attached to weeklyDates)
        if( (selectedDate == date.fullDate) && date.clickable){
          validatedDate = dateUnix;
          activeIndex = i;
          dateArray[activeIndex].active = true;
        }
      }
    });
    if(firstRun != null){
      // run a loop 12 times(12 weeks) to try to grab the nearest most recently played game
      //if no clickable date has been found and the 12 week check still works
      if(mostRecent == null && validatedDate == 0 && this.failSafe < 12){
        this.failSafe++;

        //set new curent date and chosent parameter to the last day of previous week and make that as the new view
        var curDate = moment(minDateUnix).subtract(1, 'days').tz('America/New_York').format('YYYY-MM-DD');
        this.chosenParam.date = curDate;

        var params = this.chosenParam;
        this.curDateView = {profile: params.profile, teamId: params.teamId, date: params.date};

        //recall function with same chosenParam for validating
        this.callWeeklyApi(this.chosenParam)
        .subscribe( data => {
          this.validateDate(this.chosenParam.date, this.weeklyDates, true);
        })
      }else{
        //reset failsafe
        this.failSafe = 0;
        //make sure to only set new params if new number has been validatedDated
        //otherwise set the new chosenParam to the mostRecent date that has been found
        if(validatedDate != 0){
          validatedDate = moment(Number(validatedDate)).tz('America/New_York').format('YYYY-MM-DD');
          this.chosenParam.date = validatedDate;
          dateArray[activeIndex].active = true;
        }else{
          validatedDate = moment(Number(mostRecent)).tz('America/New_York').format('YYYY-MM-DD');
          this.chosenParam.date = validatedDate;
          dateArray[activeIndex].active = true;
        }

        //sets new params and emit the date
        let params = this.chosenParam;
        this.curDateView = {profile: params.profile, teamId: params.teamId, date: params.date};
        this.dateEmit.next({profile: params.profile, teamId: params.teamId, date: params.date});//esmit variable that has been validated
      }
    }
    //change validatedDate back into format for dateArray;
  }
}
