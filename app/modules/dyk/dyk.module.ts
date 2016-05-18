import {Component, OnInit, OnChanges, Input} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';

export interface dykModuleData{
  info: string;
}

@Component({
    selector: 'dyk-module',
    templateUrl: './app/modules/dyk/dyk.module.html',
    directives: [ModuleHeader],
})

export class DYKModule implements OnInit, OnChanges {
  @Input() profileName: string;
  @Input() dykData: Array<dykModuleData>;

  public headerInfo: ModuleHeaderData = {
    moduleTitle: "Did You Know - [Profile Name]",
    hasIcon: false,
    iconClass: ""
  };

  ngOnChanges() {
    let profileName = this.profileName ? this.profileName : "MLB";
    this.headerInfo.moduleTitle = "Did You Know - " + profileName;
  }//ngOnChanges ends

  ngOnInit(){ }//ngOnInit ends
}
