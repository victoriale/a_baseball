import {Component, OnInit} from 'angular2/core';
import {DraftHistoryModule} from '../../modules/draft-history/draft-history.module';
import {ShareModule, ShareModuleInput} from '../../modules/share/share.module';


@Component({
    selector: 'Design-page',
    templateUrl: './app/webpages/design-page/design.page.html',
    directives: [DraftHistoryModule, ShareModule],
    providers: []
})

export class DesignPage implements OnInit {
    public shareModuleInput: ShareModuleInput = {
        imageUrl: './app/public/mainLogo.png'
    };

  constructor() {

  }

  ngOnInit() {

  }

}
