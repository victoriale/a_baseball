import {Component, OnInit, OnChanges, Input} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {DykService} from '../../services/dyk.service';

export interface dykData{
  info: string;
}

@Component({
    selector: 'dyk-module',
    templateUrl: './app/modules/dyk/dyk.module.html',
    directives: [ModuleHeader],
    providers: [DykService]
})

export class DYKModule implements OnInit, OnChanges {
  @Input() profileName: string;
  @Input() dykInfo: Array<{ info }>;

  public headerInfo: ModuleHeaderData = {
    moduleTitle: "Did You Know - [Profile Name]",
    hasIcon: false,
    iconClass: ""
  };

  constructor(private _dykService: DykService) {
    this._dykService.getDykService('team', 2799)
      .subscribe(data => {
        this.dykData = data;
      })
  }

  ngOnChanges() {
    let profileName = this.profileName ? this.profileName : "MLB";
    this.headerInfo.moduleTitle = "Did You Know - " + profileName;
  }//ngOnChanges ends

  ngOnInit(){ }//ngOnInit ends
}
