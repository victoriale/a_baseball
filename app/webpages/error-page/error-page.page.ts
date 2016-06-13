import {Component, OnInit} from 'angular2/core';
//import {HeroListComponent} from "../../components/hero/hero-list/hero-list.component";
// import {Router,ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
import {Injector} from 'angular2/core';
import {WebApp} from '../../app-layout/app.layout';
import {GlobalSettings} from '../../global/global-settings';
import {SidekickWrapper} from "../../components/sidekick-wrapper/sidekick-wrapper.component";

@Component({
    selector: 'Error-page',
    templateUrl: './app/webpages/error-page/error-page.page.html',

    directives: [SidekickWrapper],
    providers: [],
})
export class ErrorPage implements OnInit{
  public errorMessage: string;
  public pageLink: string;
  public partnerParam: string;
  public partnerID: string;

  constructor(private injector:Injector) {
      // Scroll page to top to fix routerLink bug
      let partnerParam = this.injector.get(WebApp);
      this.partnerID = partnerParam.partnerID;
      window.scrollTo(0, 0);
  }
  
  ngOnInit() {
    this.pageLink = GlobalSettings.getHomePage(this.partnerID);
    this.errorMessage = "Oops! That page doesn't exist! Try Refreshing or go to <a class='text-master' href='/'"+ this.pageLink +"'> our home page</a>!";
  }
}
