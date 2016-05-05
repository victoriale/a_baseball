import {Component} from 'angular2/core';

@Component({
    selector: 'disqus-component',
    templateUrl: './app/components/articles/disqus/disqus.component.html',
    inputs: ["comment"]
})

export class DisqusComponent {
}