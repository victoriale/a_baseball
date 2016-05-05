import {Pipe, PipeTransform} from 'angular2/core';

declare var moment: any;

@Pipe({
  name: 'dateTimeStamp'
})

export class DateTimePipe implements PipeTransform {  
  transform(value: Date) : string {
    let date = moment(value);
    return date.format('dddd, MMMM Do, YYYY') + ' | ' + date.format('hh:mm A') + ' ET'
  }
}