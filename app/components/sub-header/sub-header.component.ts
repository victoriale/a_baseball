import {Component, OnInit} from '@angular/core';
import {GlobalSettings} from '../../global/global-settings';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

@Component({
  selector: 'sub-header-component',
  templateUrl: './app/components/sub-header/sub-header.component.html',
  directives: [ROUTER_DIRECTIVES],
  inputs: [],
  providers: []
})

export class SubHeaderComponent{
  constructor(){}
  ngDoCheck(){
    if(GlobalSettings.getHomeInfo().isHome){
      document.getElementById('sub_header_tab').className = 'sub_header-tab sub_header-tab_border';
    }else{
      document.getElementById('sub_header_tab').className = 'sub_header-tab';
    }
  }
}
