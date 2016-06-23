import {Component, Input} from 'angular2/core';

@Component({
    selector: 'billboard-component',
    templateUrl: './app/components/articles/billboard/billboard.component.html',
    inputs: ["teamId"],
})

export class BillboardComponent {
}