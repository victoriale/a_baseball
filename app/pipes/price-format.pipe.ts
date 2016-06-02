import {Pipe, PipeTransform} from '@angular/core';
import {GlobalFunctions} from '../global/global-functions';

@Pipe({
  name: 'priceFormat',
})

export class PriceFormatPipe implements PipeTransform {  
  transform(value) : string {
    return GlobalFunctions.formatPriceNumber(value);
  }
}