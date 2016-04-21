/**
 * Created by Larry on 2/23/2016.
 */
import {Component, Input} from 'angular2/core';

@Component({
    selector: 'module-header',
    templateUrl: './app/components/module-header/module-header.component.html',
    directives:[],
    providers: []
})

export class ModuleHeader{
   @Input() moduleTitle: string;
}