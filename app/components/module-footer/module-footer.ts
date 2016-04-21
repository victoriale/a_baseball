import {Component, Input} from 'angular2/core';

// interface moduleFooter {
//
// }

@Component({
    selector: 'module-footer',
    templateUrl: './app/components/module-footer/module-footer.html',
    directives: [],
    providers: []
})

export class ModuleFooter{
    @Input() footerHeadline: string;
    @Input() footerButton: string;
}
