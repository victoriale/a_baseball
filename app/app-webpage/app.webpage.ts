import {Component, OnInit, Injector} from 'angular2/core';
import {RouteParams, Router, RouteData, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES, LocationStrategy, RouterLink} from 'angular2/router';
import {AboutUsPage} from "../webpages/aboutus-page/aboutus.page";
import {DirectoryPage} from "../webpages/directory-page/directory.page";
import {ContactUsPage} from "../webpages/contactus-page/contactus.page";
import {DisclaimerPage} from "../webpages/disclaimer-page/disclaimer.page";
import {TeamPage} from "../webpages/team-page/team.page";
import {PlayerPage} from "../webpages/player-page/player.page";
import {HomePage} from "../webpages/home-page/home-page.page";
import {ComponentPage} from "../webpages/component-page/component.page";
import {TeamrosterPage} from "../webpages/team-roster/team-roster.page";
import {ImagesTestPage} from "../webpages/images-test-page/images-test.page";
import {TablesTestPage} from "../webpages/tables-test-page/tables-test.page";
import {WebApp} from "../app-layout/app.layout";
import {GlobalFunctions} from "../global/global-functions";
import {SearchPage} from '../webpages/search-page/search.page';
import {ModulePage} from "../webpages/module-page/module.page";
import {ListPage} from "../webpages/list-page/list.page";
import {DraftHistoryPage} from "../webpages/draft-history-page/draft-history.page";
import {StandingsPage} from "../webpages/standings-page/standings.page";
//import {ArticlePageAbout} from "../webpages/articles/about/about.page";
import {AsyncRoute} from "angular2/router";
//import {ArticlePageHistory} from "../webpages/articles/history/history.page";
import {ArticlePage} from "../webpages/articles/articles/articles.page";
import {ArticlePageAbout} from "../webpages/articles/about/about.page";
import {ArticlePagePreGame} from "../webpages/articles/pregame/pregame.page";
import {ArticlePagePostGame} from "../webpages/articles/postgame/postgame.page";
import {ArticleDataService} from "../global/global-article-page-service";
import {HeadlineDataService} from "../global/global-ai-headline-module-service";

@Component({
    selector: 'my-app',
    templateUrl: './app/app-webpage/app.webpage.html',
    directives: [DraftHistoryPage, ListPage, HomePage, TeamPage, PlayerPage, DirectoryPage, AboutUsPage, ContactUsPage, DisclaimerPage, SearchPage, ComponentPage, ModulePage, RouterOutlet, ROUTER_DIRECTIVES],
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
        path: '/components',
        name: 'Component-page',
        component: ComponentPage,
    },
    {
        path: '/team',
        name: 'Team-page',
        component: TeamPage,
    },
    {
        path: '/player/:teamName/:firstName/:lastName/:playerId',
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
        name: 'Directory-page-startswith',
        component: DirectoryPage,
    },
    {
        path: '/aboutus',
        name: 'Aboutus-page',
        component: AboutUsPage,
    },
    {
        path: '/contactus',
        name: 'Contactus-page',
        component: ContactUsPage,
    },
    {
        path: '/disclaimer',
        name: 'Disclaimer-page',
        component: DisclaimerPage,
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
    {
        path: '/search',
        name: 'Search-page',
        component: SearchPage
    },
    {
        path: '/modules/:teamID',
        name: 'Module-page',
        component: ModulePage
    },
    {
        path: '/standings/:conference/:division/:teamId',
        name: 'Standings-page-team',
        component: StandingsPage
    },
    {
        path: '/standings/:conference/:division',
        name: 'Standings-page-division',
        component: StandingsPage
    },
    {
        path: '/standings/:conference',
        name: 'Standings-page-conference',
        component: StandingsPage
    },
    {
        path: '/standings',
        name: 'Standings-page',
        component: StandingsPage
    },
    {
        path: '/list',
        name: 'List-page',
        component: ListPage
    },
    {
        path: '/drafthistory',
        name: 'Draft-history-page',
        component: DraftHistoryPage
    },
    {
        path: 'team-roster',
        name: 'Teamroster-Page',
        component: TeamrosterPage
    },
    //test AI Page
    {
        path: '/articles',
        name: 'Articles-Page',
        component: ArticlePage
    },
    {
        path: '/articles/about-the-teams/:eventID',
        name: 'About-the-teams',
        component: ArticlePageAbout
    },
    {
        path: '/articles/historical-team-statistics/:eventID',
        name: 'Historical-team-statistics',
        component: ArticlePageAbout
    },
    {
        path: '/articles/last-matchup/:eventID',
        name: 'Last-matchup',
        component: ArticlePageAbout
    },
    {
        path: '/articles/starting-lineup-home/:eventID',
        name: 'Starting-lineup-home',
        component: ArticlePageAbout
    },
    {
        path: '/articles/starting-lineup-away/:eventID',
        name: 'Starting-lineup-away',
        component: ArticlePageAbout
    },
    {
        path: '/articles/injuries-home/:eventID',
        name: 'Injuries-home',
        component: ArticlePageAbout
    },
    {
        path: '/articles/injuries-away/:eventID',
        name: 'Injuries-away',
        component: ArticlePageAbout
    },
    {
        path: '/articles/upcoming-game/:eventID',
        name: 'Upcoming-game',
        component: ArticlePageAbout
    },
    {
        path: '/articles/pitcher-player-comparison/:eventID',
        name: 'Pitcher-player-comparison',
        component: ArticlePageAbout
    },
    {
        path: '/articles/catcher-player-comparison/:eventID',
        name: 'Catcher-player-comparison',
        component: ArticlePageAbout
    },
    {
        path: '/articles/first-base-player-comparison/:eventID',
        name: 'First-base-player-comparison',
        component: ArticlePageAbout
    },
    {
        path: '/articles/second-base-player-comparison/:eventID',
        name: 'Second-base-player-comparison',
        component: ArticlePageAbout
    },
    {
        path: '/articles/third-base-player-comparison/:eventID',
        name: 'Third-base-player-comparison',
        component: ArticlePageAbout
    },
    {
        path: '/articles/shortstop-player-comparison/:eventID',
        name: 'Shortstop-player-comparison',
        component: ArticlePageAbout
    },
    {
        path: '/articles/left-field-player-comparison/:eventID',
        name: 'Left-field-player-comparison',
        component: ArticlePageAbout
    },
    {
        path: '/articles/center-field-player-comparison/:eventID',
        name: 'Center-field-player-comparison',
        component: ArticlePageAbout
    },
    {
        path: '/articles/right-field-player-comparison/:eventID',
        name: 'Right-field-player-comparison',
        component: ArticlePageAbout
    },
    {
        path: '/articles/pregame-report/:eventID',
        name: 'Pregame-report',
        component: ArticlePagePreGame
    },
    {
        path: '/articles/postgame-report/:eventID',
        name: 'Postgame-report',
        component: ArticlePagePostGame
    },
    {
        path: '/articles/third-inning-report/:eventID',
        name: 'Third-inning-report',
        component: ArticlePagePreGame
    },
    {
        path: '/articles/fifth-inning-report/:eventID',
        name: 'Fifth-inning-report',
        component: ArticlePagePreGame
    },
    {
        path: '/articles/seventh-inning-stretch-report/:eventID',
        name: 'Seventh-inning-stretch-report',
        component: ArticlePagePreGame
    }
])

export class AppComponent implements OnInit {

    constructor(private _injector:Injector, private _params:RouteParams, private route:Router, private routeData:RouteData, private routerLink:RouterLink, private _globalFunctions:GlobalFunctions) {
    }

    ngOnInit() {
    }
}
