/**
 * Created by Crystal on 4/6/2016.
 */
import {Component, Input} from 'angular2/core';
import {Router} from 'angular2/router';

@Component({
    selector: 'au-header-component',
    templateUrl: './app/components/au-header/au-header.component.html',
})

export class AuHeaderComponent {
    @Input() title: string;
}
