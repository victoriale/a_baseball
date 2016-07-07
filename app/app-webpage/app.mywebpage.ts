import {Component, AfterViewChecked} from '@angular/core';
import {RouteParams, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {FooterComponent} from "../components/footer/footer.component";
import {HeaderComponent} from "../components/header/header.component";

import {HomePage} from "../webpages/home-page/home-page.page";
import {AboutUsPage} from "../webpages/about-us-page/about-us.page";
import {DirectoryPage} from "../webpages/directory-page/directory.page";
import {ContactUsPage} from "../webpages/contactus-page/contactus.page";
import {DisclaimerPage} from "../webpages/disclaimer-page/disclaimer.page";
import {ErrorPage} from "../webpages/error-page/error-page.page";
import {SearchPage} from '../webpages/search-page/search.page';

import {TeamPage} from "../webpages/team-page/team.page";
import {MLBPage} from "../webpages/mlb-page/mlb.page";
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
import {ComponentPage} from "../webpages/component-page/component.page";

import {PartnerHeader} from "../global/global-service";
import {SanitizeHtml} from "../pipes/safe.pipe";
import {SanitizeStyle} from "../pipes/safe.pipe";
import {GlobalSettings} from "../global/global-settings";

@Component({
    selector: 'my-house',
    templateUrl: './app/app-webpage/app.webpage.html',

    directives: [
        //Components for Main Layout
        HeaderComponent,
        FooterComponent,

        //Routing Directives
        RouterOutlet,
        ROUTER_DIRECTIVES
    ],
    providers: [ArticleDataService, HeadlineDataService, PartnerHeader],
    pipes:[SanitizeHtml,SanitizeStyle]
})

@RouteConfig([
    //Home Page
    {
        path: '/',
        name: 'Home-page',
        component: HomePage,
        useAsDefault: true
    },
    //Profile Pages
    {
        path: '/mlb',
        name: 'MLB-page',
        component: MLBPage,
    },
    {
        path: '/t/:teamName/:teamId',
        name: 'Team-page',
        component: TeamPage,
    },
    {
        path: '/p/:teamName/:fullName/:playerId',
        name: 'Player-page',
        component: PlayerPage,
    },
    //Misc. Pages
    {
        path: '/dir/:type/:startsWith/page/:page',
        name: 'Directory-page-starts-with',
        component: DirectoryPage,
    },
    {
        path: '/about',
        name: 'About-us-page',
        component: AboutUsPage,
    },
    {
        path: '/contactus',
        name: 'Contact-us-page',
        component: ContactUsPage,
    },
    {
        path: '/disclaimer',
        name: 'Disclaimer-page',
        component: DisclaimerPage,
    },
    {
        path: '/s/:query',
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
        path: '/p-stats/:teamName/:teamId',
        name: 'Player-stats-page',
        component: PlayerStatsPage
    },
    {
        path: '/articles/:eventType/:eventID',
        name: 'Article-pages',
        component: ArticlePages
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
        path: '/components',
        name: 'Component-page',
        component: ComponentPage,
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

export class MyAppComponent implements AfterViewChecked{
  public partnerID: string;
  public partnerData: Object;
  public partnerScript:string;
  public shiftContainer:string;
  public hideHeader:boolean;
  private isHomeRunZone:boolean = false;
  constructor(private _partnerData: PartnerHeader, private _params: RouteParams){
    var parentParams = _params.params;

    if( parentParams['partner_id'] !== null){
        this.partnerID = parentParams['partner_id'];
        this.getPartnerHeader();
    }

    this.hideHeader = GlobalSettings.getHomeInfo().hide;
  }

  getHeaderHeight(){
    var pageHeader = document.getElementById('pageHeader');
    if(pageHeader != null){
      return pageHeader.offsetHeight;
    }
  }

  getPartnerHeader(){//Since it we are receiving
    this._partnerData.getPartnerData(this.partnerID)
      .subscribe(
          partnerScript => {
              this.partnerData = partnerScript;
              this.partnerScript = this.partnerData['results'].header.script;
          }
      );
  }

  ngDoCheck(){
    var checkHeight = this.getHeaderHeight();
    if(this.shiftContainer != (checkHeight + 'px')){
      this.shiftContainer = checkHeight + 'px';
    }
  }

  ngAfterViewChecked(){
    this.shiftContainer = this.getHeaderHeight() + 'px';
  }
}
