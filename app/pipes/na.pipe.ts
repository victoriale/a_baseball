import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'naValue'
})

export class NaValuePipe implements PipeTransform {
  transform(value) : string {
    return value === null || value === undefined ? "N/A" : value;
  }
}