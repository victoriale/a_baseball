import {Component} from 'angular2/core';
import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter} from "../../components/module-footer/module-footer.component";
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {ListOfListsItem} from "../../components/list-of-lists-item/list-of-lists-item.component";
import {ModuleHeaderData} from "../../components/module-header/module-header.component";
import {RouteParams} from "angular2/router";
import {Router} from "angular2/router";
import {Input} from "angular2/core";
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
    console.log("phd",this.profileHeaderData);
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
    this.footerData['url'] = ['List-of-lists-page', { type: this.listOfListsData['type'], id: this.listOfListsData['id'], limit:10, pageNum:1}];
  }
}
