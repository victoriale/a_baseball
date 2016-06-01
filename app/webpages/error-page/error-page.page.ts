/**
 * Created by Victoria on 3/30/2016.
 */
import {Component, OnInit} from '@angular/core';
import {Injector} from '@angular/core';
import {WebApp} from '../../app-layout/app.layout';

@Component({
    selector: 'Error-page',
    templateUrl: './app/webpages/error-page/error-page.page.html',

    directives: [],
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
    this.errorMessage = "Oops! That page doesn't exist! Try Refreshing or go to <a class='text-master' href='/'"+ this.pageLink +"'> our home page</a>!";
  }
}
