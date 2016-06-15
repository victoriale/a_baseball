import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'statHyphenValue'
})

export class StatHyphenValuePipe implements PipeTransform {
  transform(value) : string {
    return value === null || value === undefined ? "-" : value;
  }
}
