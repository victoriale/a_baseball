import {Component, Input, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

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
  ngOnInit(){
    if(typeof this.menuData == 'undefined'){
      this.menuData = {
        menuTitle:'Contact Us',
        url: ['Contactus-page']
      }//example
    }
  }//ngOnInit ends
}
