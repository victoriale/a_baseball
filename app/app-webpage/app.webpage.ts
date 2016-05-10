import {Component, OnInit, Injector} from 'angular2/core';
import {RouteParams, Router, RouteData, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES, LocationStrategy, RouterLink} from 'angular2/router';
import {AboutUsPage} from "../webpages/aboutus-page/aboutus.page";
import {DirectoryPage} from "../webpages/directory-page/directory.page";
import {ContactUsPage} from "../webpages/contactus-page/contactus.page";
import {DisclaimerPage} from "../webpages/disclaimer-page/disclaimer.page";
import {TeamPage} from "../webpages/team-page/team.page";
import {MLBPage} from "../webpages/mlb-page/mlb.page";
import {PlayerPage} from "../webpages/player-page/player.page";
import {HomePage} from "../webpages/home-page/home-page.page";
import {ComponentPage} from "../webpages/component-page/component.page";
import {TeamRosterPage} from "../webpages/team-roster/team-roster.page";
import {ImagesTestPage} from "../webpages/images-test-page/images-test.page";
import {TablesTestPage} from "../webpages/tables-test-page/tables-test.page";
import {WebApp} from "../app-layout/app.layout";
import {GlobalFunctions} from "../global/global-functions";
import {SearchPage} from '../webpages/search-page/search.page';
import {ModulePage} from "../webpages/module-page/module.page";
import {ListPage} from "../webpages/list-page/list.page";
import {DraftHistoryPage} from "../webpages/draft-history-page/draft-history.page";
import {StandingsPage} from "../webpages/standings-page/standings.page";
import {AsyncRoute} from "angular2/router";
import {ArticlePage} from "../webpages/articles/articles/articles.page";
import {ArticleDataService} from "../global/global-article-page-service";
import {HeadlineDataService} from "../global/global-ai-headline-module-service";
import {ArticlePages} from "../webpages/articles/article-pages/article-pages.page";
import {ErrorPage} from "../webpages/error-page/error-page.page";


import {DesignPage} from "../webpages/design-page/design.page";

@Component({
    selector: 'my-app',
    templateUrl: './app/app-webpage/app.webpage.html',
    directives: [TeamRosterPage, DraftHistoryPage, ListPage, HomePage, TeamPage, PlayerPage, DirectoryPage, AboutUsPage, ContactUsPage, DisclaimerPage, SearchPage, ComponentPage, ModulePage, RouterOutlet, ROUTER_DIRECTIVES],
    providers: [ ROUTER_DIRECTIVES, ArticleDataService, HeadlineDataService],
})

@RouteConfig([
    {
        path: '/',
        name: 'Home-page',
        component: HomePage,
        useAsDefault: true
    },
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
    {
        path: '/directory/:type/page/:page',
        name: 'Directory-page',
        component: DirectoryPage,
    },
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
        path: '/standings/:type/:teamId',
        name: 'Standings-page-team',
        component: StandingsPage
    },
    {
        path: '/list/:profile/:listname/:sort/:conference/:division/:limit/:pageNum',
        name: 'List-page',
        component: ListPage
    },
    {
        path: '/draft-history/:teamName/:teamId',
        name: 'Draft-history-page',
        component: DraftHistoryPage
    },
    {
        path: '/team-roster/:teamName/:teamId',
        name: 'Team-roster-page',
        component: TeamRosterPage
    },
    /*  TODO-JVW uncomment after the player stats page is added
    {
        path: '/player-stats/:teamName/:teamId',
        name: 'Player-stats-page',
        component: PlayerStatsPage
    },
    */
    //test AI Page
    {
        path: '/articles',
        name: 'Articles-Page',
        component: ArticlePage
    },
    {
        path: '/articles/:eventType/:eventID',
        name: 'Article-pages',
        component: ArticlePages
	  },
    {
        path: '/error',
        name: 'Error-page',
        component: ErrorPage
    },
    // TODO remove after testing
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
        name: 'Component-page',
        component: ComponentPage,
    },
    {
        path: '/images-test',
        name: 'Images-test-page',
        component: ImagesTestPage,
    },
    {
        path: '/tables-test',
        name: 'Tables-test-page',
        component: TablesTestPage,
    },
])

export class AppComponent implements OnInit {

    constructor(private _injector:Injector, private _params:RouteParams, private route:Router, private routeData:RouteData, private routerLink:RouterLink, private _globalFunctions:GlobalFunctions) {
    }

    ngOnInit() {
    }
}
