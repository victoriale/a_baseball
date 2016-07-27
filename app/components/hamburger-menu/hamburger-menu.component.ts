import {Component, Input, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {GlobalSettings} from "../../global/global-settings";

export interface MenuData{
  menuTitle: string,
  url: any,
}

@Component({
    selector: 'hamburger-menu-component',
    templateUrl: './app/components/hamburger-menu/hamburger-menu.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [],
})

export class HamburgerMenuComponent implements OnInit {
  @Input() menuData: MenuData;
  @Input() menuInfo: MenuData;
  public menuInfoHeader: string = "Company Info";
  public isHome:any;
  constructor(){
    this.isHome = GlobalSettings.getHomeInfo().isHome;
  }
  ngOnInit(){
    if(typeof this.menuData == 'undefined'){
      this.menuData = {
        menuTitle:'Contact Us',
        url: ['Contactus-page']
      }//example
    }
  }//ngOnInit ends
}
