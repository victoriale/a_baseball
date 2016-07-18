import {Component} from '@angular/core';
import {SanitizeHtml} from "../../../pipes/safe.pipe";

@Component({
    selector: 'sidekick-container-component',
    templateUrl: './app/components/articles/sidekick-container/sidekick-container.component.html',
    directives: [],
    inputs: [],
    pipes: [SanitizeHtml],
})

export class SidekickContainerComponent {
}