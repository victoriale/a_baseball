import {Component, OnInit, Input} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Link} from '../../global/global-interface';
import {SanitizeHtml} from "../../pipes/safe.pipe";

@Component({
    selector: 'complex-inner-html',
    styles: [`
       .special-text {
           margin-left: -3px;
       }
       .main-tex {
           z-index: 1;
       }
    `],
    templateUrl: './app/components/complex-inner-html/complex-inner-html.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [],
    pipes: [SanitizeHtml]
})

export class ComplexInnerHtml {
  @Input() textItems: Array<Link | string>;
}
