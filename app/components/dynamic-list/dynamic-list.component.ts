import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import {ROUTER_DIRECTIVES, RouteConfig} from '@angular/router-deprecated';
import {GlobalSettings} from '../../global/global-settings';

import {PriceFormatPipe} from '../../pipes/price-format.pipe';

@Component({
    selector: 'dynamic-list',
    templateUrl: './app/components/dynamic-list/dynamic-list.component.html',
    
    directives: [ROUTER_DIRECTIVES],
    providers: [],
    inputs: ['listData'],
    encapsulation: ViewEncapsulation.None,
    pipes: [PriceFormatPipe]
})

export class DynamicListComponent implements OnInit{
    buttonName: string;
    infoList: any;
    listData: any;

    getData(){
      if(typeof this.listData == 'undefined'){
          this.listData =
          {
              imageURL : GlobalSettings.getSiteLogoUrl(),
              location : 'Wichita, KS',
              postal : ' 67260',
              livingarea : 'livingarea',
              address : '1234 joyfulhome data',
              subtype : 'subtype',
              numBed : 'numBed',
              numBath: 'numBath',
              date: 'Date',
              price: 'listPrice',
              buttonName: 'View Profile',
              icon: 'fa fa-map-marker',
              rank: 1,
          };
      }
    }

    ngOnInit(){
      this.getData();
    }
}
