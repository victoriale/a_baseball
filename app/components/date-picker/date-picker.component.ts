import {Component, ViewContainerRef, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {NgIf, NgFor, NgClass, NgModel, FORM_DIRECTIVES, ControlValueAccessor} from '@angular/common';
import {BoxScoresService} from '../../services/box-scores.service';
import {GlobalFunctions} from '../../global/global-functions';

declare var moment;

@Component({
  selector: 'datepicker[ngModel]',
  templateUrl: './app/components/date-picker/date-picker.component.html',
  providers: [],
  directives: [FORM_DIRECTIVES, NgIf, NgFor, NgClass],
  pipes: []
})

/**
* Input tag is needed to create create this component
* Input tag has been turned transparent but above the fa-calendar
*/
export class DatePicker implements ControlValueAccessor, AfterViewInit {
  public isOpened: boolean;
  public dateValue: string;
  public days: Array<Object>;
  public dayNames: Array<string>;
  private el: any;
  private date: any;
  private viewContainer: ViewContainerRef;
  private onChange: Function;
  private onTouched: Function;
  private cd: any;
  private cannonical: number;
  private today:string;
  private monthlyDates: any;
  private curDateView:any;

  @Input('model-format') modelFormat: string;
  @Input('view-format') viewFormat: string;
  @Input('init-date') initDate: string;
  @Input('first-week-day-sunday') firstWeekDaySunday: boolean;
  @Input('static') isStatic: boolean;
  @Input('disabled-days') disabledDays: Array<Object>;
  @Input() viewValue: string;
  @Input() chosenParam: any;

  @Output() changed = new EventEmitter<Date>();

  constructor(cd: NgModel, viewContainer: ViewContainerRef, private _boxScores:BoxScoresService) {
    cd.valueAccessor = this;
    this.cd = cd;
    this.viewContainer = viewContainer;
    this.el = viewContainer.element.nativeElement;
    this.init();
  }

  //makes weekly api call and sets reactive variables
  callMonthApi(params){
    // this.weeklyApi = null;// resets call to load loading Gif as it waits for data
    return this._boxScores.validateMonth(params.profile, params.date, params.teamId)
    .map(data=>{
      this.monthlyDates = this.monthFormat(params.date, data.data);
    });
  }

  //Below relys strongly on API whether or not it returns every correct day of the month or not
  monthFormat(dateChosen, monthData){
    var dateObj = {}
    //run through each of the Unix (UTC) dates and convert them to readable EST dates
    for(var date in monthData){
      let newDate = GlobalFunctions.getDateElement(Number(date), "fullDate");
      //set each of the dates the EST from UTC and change format to respective format
      dateObj[newDate] = monthData[date];
    }
    return dateObj;
  }

  ngAfterViewInit() {
    this.curDateView = {profile: this.chosenParam.profile, teamId:this.chosenParam.teamId, date:this.chosenParam.date}
    this.callMonthApi(this.chosenParam)
    .subscribe( data => {
      this.generateDayNames();
      this.generateCalendar(this.date);
      this.initValue();
    })
  }

  public openDatepicker(): void {
    if(this.isOpened == null || this.isOpened == false){
      this.isOpened = true;
    }else{
      this.isOpened = false;
    }
  }

  public closeDatepicker(): void {
    this.isOpened = false;
  }

  public prevYear(): void {
    this.date.subtract(1, 'Y');
    this.generateCalendar(this.date);
  }

  public prevMonth(): void {
    this.date.subtract(1, 'M');
    this.curDateView.date = this.date.tz('America/New_York').format('YYYY-MM-DD');
    this.callMonthApi(this.curDateView)
    .subscribe( data => {
      this.generateDayNames();
      this.generateCalendar(this.date);
    })
    this.generateCalendar(this.date);
  }

  public nextYear(): void {
    this.date.add(1, 'Y');
    this.generateCalendar(this.date);
  }

  public nextMonth(): void {
    this.date.add(1, 'M');
    this.curDateView.date = this.date.tz('America/New_York').format('YYYY-MM-DD');
    this.callMonthApi(this.curDateView)
    .subscribe( data => {
      this.generateDayNames();
      this.generateCalendar(this.date);
    })
    this.generateCalendar(this.date);
  }

  public selectDate(e, date): void {
    e.preventDefault();
    if (this.isSelected(date)) return;

    let selectedDate = GlobalFunctions.validMoment(date.year + '-' + date.month + '-' + date.day, 'YYYY-MM-DD');
    this.setValue(selectedDate);
    // this.closeDatepicker();
    this.changed.emit(selectedDate.toDate());
    this.closeDatepicker();
  }

  private generateCalendar(date): void {
    let lastDayOfMonth = date.endOf('month').date();
    let month = date.month();
    let year = date.year();
    let n = 1;
    let firstWeekDay = null;
    this.dateValue = "<span class='text-heavy'>"+date.format('MMM.')+" </span><span> "+date.format('YYYY')+"</span>"; //designed wanted double spacing
    this.days = [];
    var days42 = 42;
    if (this.firstWeekDaySunday === true) {
      firstWeekDay = date.set('date', 2).day();
    } else {
      firstWeekDay = date.set('date', 1).day();
    }

    if (firstWeekDay !== 1) {
      n -= firstWeekDay - 1;
    }
    if(n > 0){
      n -= 7;
    }
    var finalDaysOfWeek = days42 - lastDayOfMonth;
    finalDaysOfWeek = finalDaysOfWeek - ((n-1)*(-1));
    for (let i = n; i <= (lastDayOfMonth + finalDaysOfWeek); i += 1) {
      let fullDate = GlobalFunctions.validMoment(year + '-' + (Number(month)+1) + '-' + i, 'YYYY-MM-DD').format('YYYY-MM-DD');
      let today = (this.today == fullDate);
      if (i <= 0){
        let prevMonthLastDay = new moment().date(i).tz('America/New_York').format('D');
        this.days.push({ day: prevMonthLastDay, month: null, year: null, enabled: false, today: false });
      }else if (i > 0 && i <= lastDayOfMonth) {
        this.days.push({ day: i, month: month + 1, year: year, enabled: this.monthlyDates[fullDate], today: today});
      } else if (i > lastDayOfMonth){
        var dayAdd = i % lastDayOfMonth;
        let nextMonthFirstDay = new moment().add(1, 'months').date(dayAdd).tz('America/New_York').format('D');
        this.days.push({ day: nextMonthFirstDay, month: null, year: null, enabled: false, today: false });
      }
    }
    /* OLD CODE
    for (let i = n; i <= lastDayOfMonth; i += 1) {
      let fullDate = moment(date.year + '-' + date.month + '-' + date.day, 'DD-MM-YYYY')
      if (i > 0) {
        this.days.push({ day: i, month: month + 1, year: year, enabled: true});
      } else {
        this.days.push({ day: null, month: null, year: null, enabled: false });
      }
    }
    */
  }

  isSelected(date) {
    let selectedDate = GlobalFunctions.validMoment(date.year + '-' + date.month + '-' + date.day, 'YYYY-MM-DD');
    return selectedDate.toDate().getTime() === this.cannonical;
  }

  private generateDayNames(): void {
    this.dayNames = [];
    let date = this.firstWeekDaySunday === true ? GlobalFunctions.validMoment('2015-06-07') : GlobalFunctions.validMoment('2015-06-01');
    for (let i = 0; i < 7; i += 1) {
      this.dayNames.push(date.format('dd'));
      date.add('1', 'd');
    }
  }

  private initMouseEvents(): void {
    let body = document.getElementsByTagName('body')[0];

    body.addEventListener('click', (e) => {
      if (!this.isOpened || !e.target) return;
      if (this.el !== e.target && !this.el.contains(e.target)) {
        this.closeDatepicker();
      }
    }, false);
  }

  private setValue(value: any): void {
    let val = GlobalFunctions.validMoment(value, this.modelFormat || 'YYYY-MM-DD');
    this.viewValue = val.format(this.viewFormat || 'Do MMM. YYYY');
    this.cd.viewToModelUpdate(val.format(this.modelFormat || 'YYYY-MM-DD'));
    this.cannonical = val.toDate().getTime();
  }

  private initValue(): void {
    setTimeout(() => {
      if (!this.initDate) {
        this.setValue(moment().format(this.modelFormat || 'YYYY-MM-DD'));
      } else {
        this.setValue(GlobalFunctions.validMoment(this.initDate, this.modelFormat || 'YYYY-MM-DD'));
      }
    });
  }

  writeValue(value: string): void {
    if (!value) return;
    this.setValue(value);
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: any) => {}): void {
    this.onTouched = fn;
  }

  private init(): void {
    this.isOpened = false;
    this.date = moment().tz('America/New_York');
    this.today = moment().tz('America/New_York').format('YYYY-MM-DD');
    this.firstWeekDaySunday = true;
    this.initMouseEvents();
  }
}
