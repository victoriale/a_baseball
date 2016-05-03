import {Component, OnInit} from 'angular2/core';
import {Router,ROUTER_DIRECTIVES} from 'angular2/router';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent} from '../../components/title/title.component';
import {TitleInputData} from "../../components/title/title.component";
import {CircleImage} from '../../components/images/circle-image';
import {ImageData,CircleImageData} from '../../components/images/image-data';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {Carousel} from '../../components/carousels/carousel.component';
import {CustomTable} from '../../components/custom-table/custom-table.component';
import {TableColumn, TableRow, TableCell} from '../../components/custom-table/table-data.component';

@Component({
    selector: 'Teamroster-page',
    templateUrl: './app/webpages/team-roster/team-roster.page.html',

    directives: [BackTabComponent, TitleComponent, CircleImage, Tabs, Tab, Carousel, CustomTable, ROUTER_DIRECTIVES],
    providers: [],
})

export class TeamrosterPage implements OnInit{
  titleData: TitleInputData;
  constructor() {
    this.getData();
  }
  getData(){
    this.titleData = {
        imageURL : '/app/public/mainLogo.png',
        text1: 'Last Updated: Monday, March 21, 2016',
        text2: ' United States of America',
        text3: 'Team Roster - [Team Name]',
        text4: '',
        icon: 'fa fa-map-marker',
        hasHover: false
    };

  }
  ngOnInit(){}
}
