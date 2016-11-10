import {Pipe, PipeTransform} from '@angular/core';
import {GlobalFunctions} from '../global/global-functions';

declare var moment: any;

@Pipe({
  name: 'dateTimeStamp'
})

export class DateTimePipe implements PipeTransform {
  transform(value: any) : string {
    let date = moment(value);
    return GlobalFunctions.formatGlobalDate(date,'timeZone');
  }
}
