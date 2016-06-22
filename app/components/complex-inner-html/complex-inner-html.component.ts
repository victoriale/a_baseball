import {Component, OnInit, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Link} from '../../global/global-interface';

@Component({
    selector: 'complex-inner-html',
    templateUrl: './app/components/complex-inner-html/complex-inner-html.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [],
})

export class ComplexInnerHtml {
  @Input() textItems: Array<Link | string>;
}
