import {Component, Input} from '@angular/core';

@Component({
    selector: 'sidekick-container-component',
    templateUrl: './app/components/articles/sidekick-container/sidekick-container.component.html',
    inputs: ['trending']
})

export class SidekickContainerComponent {
    isSmall:boolean = false;

    onResize(event) {
        this.isSmall = event.target.innerWidth <= 640;
    }
}