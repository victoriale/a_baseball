import {Component, Input, OnInit} from 'angular2/core';
import {WidgetModule} from "../../modules/widget/widget.module";

@Component({
    selector: 'sidekick-wrapper',
    templateUrl: './app/components/sidekick-wrapper/sidekick-wrapper.component.html',
    directives:[WidgetModule],
    providers: []
})

export class SidekickWrapper {}
