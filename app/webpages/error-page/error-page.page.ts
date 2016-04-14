/**
 * Created by Victoria on 3/30/2016.
 */
import {Component, OnInit} from 'angular2/core';
import {HeroListComponent} from "../../components/hero/hero-list/hero-list.component";
// import {Router,ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
import {Injector} from 'angular2/core';
import {WebApp} from '../../app-layout/app.layout';

@Component({
    selector: 'Error-page',
    templateUrl: './app/webpages/error-page/error-page.page.html',
    
    directives: [HeroListComponent],
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
  ngOnInit(){
    if(this.partnerID === null ){
      this.pageLink = "http://www.joyfulhome.com";
    } else {
      this.pageLink = "http://www.myhousekit.com/" + this.partnerID;
    }    
    this.errorMessage = "<p>Oops! That page doesn't exist! Try looking for a location below or go to <a style='color: #44b224; text-decoration: inherit;' href='"+ this.pageLink +"'> our home page</a>!</p>";
  }
}
