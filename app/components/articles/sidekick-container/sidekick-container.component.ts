import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'sidekick-container-component',
    templateUrl: './app/components/articles/sidekick-container/sidekick-container.component.html',
    inputs: ['trending']
})

export class SidekickContainerComponent implements OnInit{
    isSmall:boolean = false;

    onResize(event) {
      this.isSmall = event.target.innerWidth <= 640;
    }
    ngOnInit() {
      this.isSmall = window.innerWidth <= 640;
    }
}
