import {Component} from '@angular/core';
import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter} from "../../components/module-footer/module-footer.component";
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {ListOfListsItem} from "../../components/list-of-lists-item/list-of-lists-item.component";
import {ModuleHeaderData} from "../../components/module-header/module-header.component";
import {RouteParams} from "@angular/router-deprecated";
import {Router} from "@angular/router-deprecated";
import {Input} from "@angular/core";
import {ProfileHeaderData} from "../profile-header/profile-header.module";

export interface ListOfListsData {
  listData: any;
}

@Component({
    selector: 'list-of-lists',
    templateUrl: './app/modules/list-of-lists/list-of-lists.module.html',
    directives: [ModuleHeader, ModuleFooter, ListOfListsItem],
})

export class ListOfListsModule{
  @Input() profileHeaderData : ProfileHeaderData;
  @Input() listOfListsData : ListOfListsData;
  moduleHeader: ModuleHeaderData;
  displayData: Array<any>;
  footerData: Object;

  constructor(private _router: Router) {
    this.footerData = {
      infoDesc:'Want to see more lists like the ones above?',
      btn:'',
      text:'VIEW MORE LISTS',
      url:['Error-page'], // Gets updated in ngOnChanges
    }
  }

  ngOnChanges(event) {
    if(typeof event.listOfListsData != 'undefined'){
      this.displayData = this.listOfListsData.listData;
    }
    this.moduleHeader = {
      moduleTitle: "Top Lists - " + this.profileHeaderData.profileName,
      hasIcon: false,
      iconClass: "",
    }
    var type = this.listOfListsData['type'];
    var routeName = type == "league" ? 'List-of-lists-league-page' : 'List-of-lists-page';
    var params = {
      limit:10,
      pageNum:1
    };
    if ( this.listOfListsData['id'] ) {
      params["id"] = this.listOfListsData['id'];
    }
    if ( type != "league" ) {
      params["type"] = type;
    }
    this.footerData['url'] = [routeName, params];
  }
}
