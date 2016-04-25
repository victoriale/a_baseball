import {Component, Input, Output, OnInit, EventEmitter} from 'angular2/core';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {ModuleFooter} from '../../components/module-footer/module-footer';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {SliderCarousel} from '../../components/slider-carousel/slider-carousel.component';
import {BoxSortComponent} from '../../components/box-sort/box-sort.component';

@Component({
    selector: 'team-roster-module',
    templateUrl: './app/modules/team-roster/team-roster.module.html',
    directives:[BoxSortComponent, ModuleHeader, ModuleFooter, Tabs, Tab, SliderCarousel],
    providers: []
})
export class TeamRosterModule implements OnInit{
    public moduleTitle: string = 'Team Roster - [Team Name]';
    public footerHeadline: string = 'Want to see the full team roster?';
    public footerButton: string = 'VIEW FULL ROSTER';
    public teamRosterData: Object;

    getData(){
      this.teamRosterData = {
        trDataList: [
          {
            boxTitle: "PLAYER",
            boxWidth: "285px"
          },
          {
            boxTitle: "POS.",
            boxWidth: "60px"
          },
          {
            boxTitle: "HEIGHT",
            boxWidth: "75px"
          },
          {
            boxTitle: "WEIGHT",
            boxWidth: "75px"
          },
          {
            boxTitle: "AGE",
            boxWidth: "50px"
          },
          {
            boxTitle: "SALARY",
            boxWidth: "90px"
          }
        ]//trDataList ends
      }//team roster data ends
    }//get data ends
    ngOnInit(){
      this.getData();
    }

}
//285px PLAYER
