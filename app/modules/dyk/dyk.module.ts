import {Component, OnInit, Input} from 'angular2/core';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {DYKService} from '../../services/dyk.service';

export interface dykData{
  info: string;
}

@Component({
    selector: 'dyk-module',
    templateUrl: './app/modules/dyk/dyk.module.html',
    directives: [ModuleHeader],
    providers: [DYKService]
})

export class DYKModule{
    public moduleTitle: string = 'Did You Know - [Profile Name]';
    public dykInfo: Object;
    constructor(private _dykService: DYKService) {
      this.getData();
    }
    getData(){
      this._dykService.getDYKService()
        .subscribe(data => {
          console.log(data);
        })
    }
    ngOnInit(){
      this.dykInfo = [{
        info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa."
      },{
        info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo con sunt in culpa."
      },{
        info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, culpa.",
      },{
        info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
      }]
    }
}
