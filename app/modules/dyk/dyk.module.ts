import {Component, OnInit} from 'angular2/core';
import {ModuleHeader} from '../../components/module-header/module-header.component';

@Component({
    selector: 'dyk-module',
    templateUrl: './app/modules/dyk/dyk.module.html',
    directives: [ModuleHeader],
    providers: []
})

export class DYKModule{
    public moduleTitle: string = 'Did You Know - [Profile Name]';
    getData(){

    }
    ngOnInit(){
      this.getData();
    }
}
