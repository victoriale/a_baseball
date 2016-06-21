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
  /**
   * To prevent a link, set the 'route' field of the Link to null or undefined.
   */
  @Input() textItems: Array<Link>;
}
