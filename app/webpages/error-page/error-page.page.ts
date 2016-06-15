import {Component, Injector} from 'angular2/core';
import {Router,ROUTER_DIRECTIVES} from 'angular2/router';
import {GlobalSettings} from '../../global/global-settings';
import {SidekickWrapper} from "../../components/sidekick-wrapper/sidekick-wrapper.component";

@Component({
    selector: 'Error-page',
    templateUrl: './app/webpages/error-page/error-page.page.html',

    directives: [SidekickWrapper],
    providers: [],
})
export class ErrorPage {
  public errorMessage: string;
  public pageLink: string;

  constructor(private _router:Router) {
      GlobalSettings.getPartnerID(_router, partnerID => this.loadData(partnerID));
  }
  
  loadData(partnerID:string) {
    this.pageLink = GlobalSettings.getHomePage(partnerID);
    this.errorMessage = "Oops! That page doesn't exist! Try Refreshing or go to <a class='text-master' href='/'"+ this.pageLink +"'> our home page</a>!";
  }
}
