import {Component, OnInit, OnChanges, Input} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from "angular2/router";

@Component({
    selector: 'footer-component',
    templateUrl: './app/components/footer/footer.component.html',
    directives: [ROUTER_DIRECTIVES],
    inputs: [],
    providers: [],
})
export class FooterComponent implements OnInit {
    ngOnInit() {
    }
}
