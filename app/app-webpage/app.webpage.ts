import {Component, AfterViewChecked, OnInit} from '@angular/core';
import {RouteParams, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';

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

import {ModulePage} from "../webpages/module-page/module.page";
import {ImagesTestPage} from "../webpages/images-test-page/images-test.page";

import {SanitizeHtml} from "../pipes/safe.pipe";
import {SanitizeStyle} from "../pipes/safe.pipe";
import {GlobalSettings} from "../global/global-settings";

//FOR DEEP DIVE
import {SyndicatedArticlePage} from "../webpages/syndicated-article-page/syndicated-article-page.page";
import {DeepDivePage} from "../webpages/deep-dive-page/deep-dive.page";
import {PartnerHeader} from "../global/global-service";
import {ArticleDataService} from "../services/ai-article.service";
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
    providers: [PartnerHeader, ArticleDataService],
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
        path: '/images-test',
        name: 'Images-test-page',
        component: ImagesTestPage,
    }
])

export class AppComponent{
  public partnerID: string;
  public partnerData: Object;
  public partnerScript:string;
  public shiftContainer:string;
  public hideHeader: boolean;
  public iframeMaxHeight: any;
  private isHomeRunZone:boolean = false;
  private scrollPadding:string = '100px';

  constructor(private _partnerData: PartnerHeader, private _params: RouteParams, private _router: Router){
    //this.hideHeader = GlobalSettings.getHomeInfo().hide;
    if(window.location.hostname.split(".")[0].toLowerCase() == "baseball"){
        this.partnerID = window.location.hostname.split(".")[1] + "." + window.location.hostname.split(".")[2];
        this.getPartnerHeader();
    }
  }

  getHeaderHeight(){
    var pageHeader = document.getElementById('pageHeader'); // height of the main header
    var pageLowerHeader = document.getElementById('salad-bar-top'); // height of the salad bar header
    if(pageHeader != null && pageLowerHeader != null){
      return pageHeader.offsetHeight + pageLowerHeader.offsetHeight;
    }
  }

  getPartnerHeader(){//Since it we are receiving
    if(this.partnerID != null){
      this._partnerData.getPartnerData(this.partnerID)
        .subscribe(
          partnerScript => {
            this.partnerData = partnerScript;
            this.partnerScript = this.partnerData['results'].header.script;
            this.iframeMaxHeight = this.partnerData['results'].header.height + 'px';
          }
        );
    }
  }

  ngDoCheck(){
    var checkHeight = this.getHeaderHeight();
    if(this.shiftContainer != (checkHeight + 'px')){
      this.shiftContainer = checkHeight + 'px';
    }
  }

  setScrollPadding(event) {
    this.scrollPadding = event + 'px';
  }

  setPageSize(ths){
    function getPartnerHeaderHeight(){
        var scrollTop = jQuery(window).scrollTop();
        var partnerHeight = 0;
        if( document.getElementById('partner') != null && scrollTop <=  (document.getElementById('partner').offsetHeight)){
          partnerHeight = document.getElementById('partner').offsetHeight - scrollTop;
      }
      return partnerHeight;
    }

    //jQuery("#webContainer").removeClass('deep-dive-container directory-rails pick-a-team-container profile-container basic-container');
    // Handle all the exceptions here
   /* jQuery("deep-dive-page").parent().addClass('deep-dive-container');
    jQuery("directory-page").parent().addClass('directory-rails');
    jQuery("home-page").parent().addClass('pick-a-team-container');
    // Handle the basic (consistent) pages here
    if(jQuery("deep-dive-page").add("directory-page").add("home-page").length < 1) {
        jQuery("sidekick-wrapper").parent().parent().addClass('basic-container');
    }
    var isTakenOver = false;
    var intvl = setInterval(function(){
      //Looking at component/module tags
        var pageWrappers = jQuery("deep-dive-page").add("article-pages").add("syndicated-article-page").add("directory-page").add("home-page");
        // should only run once
        if (!isTakenOver && pageWrappers.add("sidekick-wrapper").length > 0 ){
            jQuery("#webContainer").removeClass('deep-dive-container directory-rails pick-a-team-container profile-container basic-container');
            // Handle all the exceptions here
            jQuery("deep-dive-page").parent().addClass('deep-dive-container');
            jQuery("directory-page").parent().addClass('directory-rails');
            jQuery("home-page").parent().addClass('pick-a-team-container');

            // Handle the basic (consistent) pages here
            if(pageWrappers.length < 1) {
                jQuery("sidekick-wrapper").parent().parent().addClass('basic-container');
            }
            //This has to be resize to trigger the takeover update
            try {
                window.dispatchEvent(new Event('resize'));
            }catch(e){
                //to run resize event on IE
                var resizeEvent = document.createEvent('UIEvents');
                resizeEvent.initUIEvent('resize', true, false, window, 0);
                window.dispatchEvent(resizeEvent);
            }
            isTakenOver = true;
            clearInterval(intvl);
            /!*jQuery('#ddto-left-ad').css('top', (getPartnerHeaderHeight() + 100) + "px");
            jQuery('#ddto-right-ad').css('top', (getPartnerHeaderHeight() + 100) + "px");*!/
        }
    },100);*/
   /* window.addEventListener("scroll",  function(){
      jQuery('#ddto-left-ad').css('top', (getPartnerHeaderHeight() + 100) + "px");
      jQuery('#ddto-right-ad').css('top', (getPartnerHeaderHeight() + 100) + "px");
    });*/
  }

  /*ngOnInit(){
    var self = this;
    var script = document.createElement("script");
    script.src = '//w1.synapsys.us/widgets/deepdive/rails/rails.js?selector=.web-container&adMarginTop=100';
    document.head.appendChild(script);
    this.shiftContainer = this.getHeaderHeight() + 'px';
    //  Need this for when you navigate to new page.  Load event is triggered from app.domain.ts
    window.addEventListener("load", this.setPageSize);
    // Initialize the first time app.webpage.ts loads
    this.setPageSize(this);
  }*/
}
