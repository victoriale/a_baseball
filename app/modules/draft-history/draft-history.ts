import {Component} from 'angular2/core';
import {DetailedListItem} from '../../components/detailed-list-item/detailed-list-item';
import {ModuleFooter} from '../../components/module-footer/module-footer';
import {ModuleHeader} from '../../components/module-header/module-header.component';

interface DraftHistory{

}

@Component({
    selector: 'draft-history',
    templateUrl: './app/modules/draft-history/draft-history.html',
    directives: [DetailedListItem, ModuleHeader, ModuleFooter],
    providers: [],
    inputs:['locData']
})

export class DraftHistoryModule{
  moduleTitle:string = "Module Title";
  testData: Array<Object> = [
    {
    dataPoints:[
      {
        data:'test',
        value:'',
        url:'',
        icon:'fa fa-share'//test remove when done testing
      },
      {
        data:'[Profile name1]',
        value:'[Data Value 1]',
        url:'',
        icon:''
      },
      {
        data:'[Data Value]: [City], [ST]',
        value:'[Data Description1]',
        url:'',
        icon:'fa fa-map-marker'
      },
    ],
    rank:'1',
    infoDesc:'Want more info about this [profile type]?',
    ctaBtn:'',
    ctaText:'View Profile',
    ctaUrl:'',
    footer:{
      infoDesc:'Want to see everybody involved in this list',
      btn:'',
      text:'VIEW THE LIST',
      url:'',
    }
  },
  {
    dataPoints:[
      {
        data:'',
        value:'',
        url:'',
        icon:''//test remove when done testing
      },
      {
        data:'[Profile name2]',
        value:'[Data Value 2]',
        url:'',
        icon:''
      },
      {
        data:'[Data Value]: [City], [ST]',
        value:'[Data Description1]',
        url:'',
        icon:'fa fa-map-marker'
      },
    ],
    rank:'2',
    infoDesc:'Want more info about this [profile type]?',
    ctaBtn:'',
    ctaText:'View Profile',
    ctaUrl:'',
    footer:{
      infoDesc:'Want to see everybody involved in this list',
      btn:'',
      text:'VIEW THE LIST',
      url:'',
    }
  }];
  constructor(){
    console.log('draft-history test',this.testData);
  }
}
