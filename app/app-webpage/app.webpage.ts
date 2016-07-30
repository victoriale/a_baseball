import {Component, AfterViewChecked, OnInit} from '@angular/core';
import {RouteParams, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {GlobalFunctions} from "../global/global-functions";
import {FooterComponent} from "../components/footer/footer.component";
import {HeaderComponent} from "../components/header/header.component";

import {PickTeamPage} from "../webpages/home-page/home-page.page";
import {AboutUsPage} from "../webpages/about-us-page/about-us.page";
import {DirectoryPage} from "../webpages/directory-page/directory.page";
import {ContactUsPage} from "../webpages/contactus-page/contactus.page";
import {DisclaimerPage} from "../webpages/disclaimer-page/disclaimer.page";
import {ErrorPage} from "../webpages/error-page/error-page.page";
import {SearchPage} from '../webpages/search-page/search.page';

import {MLBPage} from "../webpages/mlb-page/mlb.page";
import {TeamPage} from "../webpages/team-page/team.page";
import {PlayerPage} from "../webpages/player-page/player.page";

import {PlayerStatsPage} from "../webpages/player-stats-page/player-stats.page";
import {TeamRosterPage} from "../webpages/team-roster/team-roster.page";
import {ListPage} from "../webpages/list-page/list.page";
import {SchedulesPage} from "../webpages/schedules-page/schedules.page";
import {DraftHistoryPage} from "../webpages/draft-history-page/draft-history.page";
import {SeasonStatsPage} from "../webpages/season-stats-page/season-stats.page";
import {StandingsPage} from "../webpages/standings-page/standings.page";
import {ArticlePages} from "../webpages/article-pages/article-pages.page";
import {ListOfListsPage} from "../webpages/list-of-lists-page/list-of-lists.page";
import {TransactionsPage} from "../webpages/transactions-page/transactions.page";
import {MVPListPage} from "../webpages/mvp-list-page/mvp-list.page";

import {ArticleDataService} from "../global/global-article-page-service";
import {HeadlineDataService} from "../global/global-ai-headline-module-service";

import {ModulePage} from "../webpages/module-page/module.page";
import {ImagesTestPage} from "../webpages/images-test-page/images-test.page";
import {DesignPage} from "../webpages/design-page/design.page";

import {SanitizeHtml} from "../pipes/safe.pipe";
import {SanitizeStyle} from "../pipes/safe.pipe";
import {GlobalSettings} from "../global/global-settings";

//FOR DEEP DIVE
import {SyndicatedArticlePage} from "../webpages/syndicated-article-page/syndicated-article-page.page";
import {DeepDivePage} from "../webpages/deep-dive-page/deep-dive.page";
declare var jQuery: any;

@Component({
    selector: 'my-app',
    templateUrl: './app/app-webpage/app.webpage.html',
    directives: [
        //Components for Main Layout
        HeaderComponent,
        FooterComponent,

        //Routing Directives
        RouterOutlet,
        ROUTER_DIRECTIVES
    ],
    providers: [ArticleDataService, HeadlineDataService],
    pipes:[SanitizeHtml, SanitizeStyle]
})

@RouteConfig([
    //Home Page
    {
      path: '/',
      name: 'Home-page',
      component: DeepDivePage,
      useAsDefault: true
    },
    {
        path: '/pick-a-team',
        name: 'Pick-team-page',
        component: PickTeamPage,
    },
    //Profile Pages
    {
        path: '/mlb',
        name: 'MLB-page',
        component: MLBPage,
    },
    {
        path: '/team/:teamName/:teamId',
        name: 'Team-page',
        component: TeamPage,
    },
    {
        path: '/player/:teamName/:fullName/:playerId',
        name: 'Player-page',
        component: PlayerPage,
    },
    //Misc. Pages
    {
        path: '/directory/:type/:startsWith/page/:page',
        name: 'Directory-page-starts-with',
        component: DirectoryPage,
    },
    {
        path: '/about-us',
        name: 'About-us-page',
        component: AboutUsPage,
    },
    {
        path: '/contact-us',
        name: 'Contact-us-page',
        component: ContactUsPage,
    },
    {
        path: '/disclaimer',
        name: 'Disclaimer-page',
        component: DisclaimerPage,
    },
    {
        path: '/search/:query',
        name: 'Search-page',
        component: SearchPage
    },
    //Module Pages
    {
        path: '/mvp-list/:type/:pageNum',
        name: 'MVP-list-page',
        component: MVPListPage
    },
    {
        path: '/mvp-list/:type/:tab/:pageNum',
        name: 'MVP-list-tab-page',
        component: MVPListPage
    },
    {
        path: '/schedules/mlb/:pageNum',
        name: 'Schedules-page-league',
        component: SchedulesPage
    },
    {
        path: '/schedules/mlb/:tab/:pageNum',
        name: 'Schedules-page-league-tab',
        component: SchedulesPage
    },
    {
        path: '/schedules/:teamName/:teamId/:pageNum',
        name: 'Schedules-page-team',
        component: SchedulesPage
    },
    {
        path: '/schedules/:teamName/:tab/:teamId/:pageNum',
        name: 'Schedules-page-team-tab',
        component: SchedulesPage
    },
    {
        path: '/standings',
        name: 'Standings-page',
        component: StandingsPage
    },
    {
        path: '/standings/:type',
        name: 'Standings-page-league',
        component: StandingsPage
    },
    {
        path: '/standings/:type/:teamName/:teamId',
        name: 'Standings-page-team',
        component: StandingsPage
    },
    {
        path: '/list/:query',
        name: 'Dynamic-list-page',
        component: ListPage
    },
    {
        path: '/list/:profile/:listname/:sort/:conference/:division/:limit/:pageNum',
        name: 'List-page',
        component: ListPage
    },
    {
        path: '/draft-history',
        name: 'Draft-history-mlb-page',
        component: DraftHistoryPage
    },
    {
        path: '/draft-history/:teamName/:teamId',
        name: 'Draft-history-page',
        component: DraftHistoryPage
    },
    {
        path: '/transactions/:teamName/:teamId/:limit/:pageNum',
        name: 'Transactions-page',
        component: TransactionsPage
    },
    {
        path: '/transactions/league/:limit/:pageNum',
        name: 'Transactions-mlb-page',
        component: TransactionsPage
    },
    {
        path: '/team-roster/:teamName/:teamId',
        name: 'Team-roster-page',
        component: TeamRosterPage
    },
    {
        path: '/season-stats/:fullName/:playerId',
        name: 'Season-stats-page',
        component: SeasonStatsPage
    },
    {
        path: '/player-stats/:teamName/:teamId',
        name: 'Player-stats-page',
        component: PlayerStatsPage
    },
    {
        path: '/articles/:eventType/:eventID',
        name: 'Article-pages',
        component: ArticlePages
	  },
    {
        path: '/news/:articleType/:eventID',
        name: 'Syndicated-article-page',
        component: SyndicatedArticlePage
	  },
    {
        path: '/list-of-lists/:scope/:type/:id/:limit/:pageNum',
        name: 'List-of-lists-page-scoped',
        component: ListOfListsPage
    },
    {
        path: '/list-of-lists/:type/:id/:limit/:pageNum',
        name: 'List-of-lists-page',
        component: ListOfListsPage
    },
    {
        path: '/list-of-lists/league/:limit/:pageNum',
        name: 'List-of-lists-league-page',
        component: ListOfListsPage
    },
    //Error pages and error handling
    {
        path: '/error',
        name: 'Error-page',
        component: ErrorPage
    },
    {
        path: '/not-found',
        name: 'NotFound-page',
        component: ErrorPage
    },
    {
        path: '/*path',
        redirectTo: ['NotFound-page']
    },
    // Test Pages - TODO: remove after testing
    {
        path: '/modules/:teamID',
        name: 'Module-page',
        component: ModulePage
    },
    {
        path: '/design/:teamId',
        name: 'Design-page',
        component: DesignPage,
    },
    {
        path: '/images-test',
        name: 'Images-test-page',
        component: ImagesTestPage,
    }
])

export class AppComponent implements OnInit{
  public shiftContainer:string;
  public hideHeader: boolean;
  private isHomeRunZone:boolean = false;
  constructor(private _params: RouteParams){
    this.hideHeader = GlobalSettings.getHomeInfo().hide;
  }

  getHeaderHeight(){
    var pageHeader = document.getElementById('pageHeader');
    if(pageHeader != null){
      return pageHeader.offsetHeight;
    }
  }


  ngDoCheck(){
    var checkHeight = this.getHeaderHeight();
    if(this.shiftContainer != (checkHeight + 'px')){
      this.shiftContainer = checkHeight + 'px';
    }
  }

  setPageSize(){
    if(jQuery("#webContainer").hasClass('deep-dive-container')){
      jQuery("#webContainer").removeClass('deep-dive-container');
    }
    if(jQuery("#webContainer").hasClass('directory-rails')){
      jQuery("#webContainer").removeClass('directory-rails');
    }
    if(jQuery("#webContainer").hasClass('pick-a-team-container')){
      jQuery("#webContainer").removeClass('pick-a-team-container');
    }
    jQuery("deep-dive-page").parent().addClass('deep-dive-container');
    jQuery("directory-page").parent().addClass('directory-rails');
    jQuery("home-page").parent().addClass('pick-a-team-container');

    var elem = document.querySelector('deep-dive-page');
    var intvl = setInterval(function(){
        if (!elem || !elem.parentNode){
          if(jQuery("#webContainer").hasClass('deep-dive-container')){
            jQuery("#webContainer").removeClass('deep-dive-container');
          }
          if(jQuery("#webContainer").hasClass('directory-rails')){
            jQuery("#webContainer").removeClass('directory-rails');
          }
          if(jQuery("#webContainer").hasClass('pick-a-team-container')){
            jQuery("#webContainer").removeClass('pick-a-team-container');
          }
          jQuery("deep-dive-page").parent().addClass('deep-dive-container');
          jQuery("directory-page").parent().addClass('directory-rails');
          jQuery("home-page").parent().addClass('pick-a-team-container');

          window.dispatchEvent(new Event('resize'));
        }
    },100);

    window.dispatchEvent(new Event('resize'));
  }
  ngOnInit(){
    //this._elementRef.nativeElement.getElementsByClassName('deep-dive-page').className('deep-dive-container');
    console.log("header", this.getHeaderHeight());
    var script = document.createElement("script");
    script.src = 'http://w1.synapsys.us/widgets/deepdive/rails/rails.js?selector=.web-container&adMarginTop=100';
    document.head.appendChild(script);
    this.shiftContainer = this.getHeaderHeight() + 'px';
    window.addEventListener("load", this.setPageSize);
  }
}
