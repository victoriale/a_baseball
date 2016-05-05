import {Component, OnInit, Injector} from 'angular2/core';
import {RouteParams, Router, RouteData, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES, LocationStrategy, RouterLink} from 'angular2/router';
import {AboutUsPage} from "../webpages/aboutus-page/aboutus.page";
import {DirectoryPage} from "../webpages/directory-page/directory.page";
import {ContactUsPage} from "../webpages/contactus-page/contactus.page";
import {DisclaimerPage} from "../webpages/disclaimer-page/disclaimer.page";
import {TeamPage} from "../webpages/team-page/team.page";
import {HomePage} from "../webpages/home-page/home-page.page";
import {ComponentPage} from "../webpages/component-page/component.page";
import {TeamrosterPage} from "../webpages/team-roster/team-roster.page";
import {ImagesTestPage} from "../webpages/images-test-page/images-test.page";
import {TablesTestPage} from "../webpages/tables-test-page/tables-test.page";
import {WebApp} from "../app-layout/app.layout";
import {GlobalFunctions} from "../global/global-functions";
import {SearchPage} from '../webpages/search-page/search.page';
import {ModulePage} from "../webpages/module-page/module.page";
import {StandingsPage} from "../webpages/standings-page/standings.page";
//import {ArticlePageAbout} from "../webpages/articles/about/about.page";
import {AsyncRoute} from "angular2/router";
//import {ArticlePageHistory} from "../webpages/articles/history/history.page";
import {ArticlePage} from "../webpages/articles/articles/articles.page";
import {ArticleDataService} from "../global/global-service";

@Component({
    selector: 'my-app',
    templateUrl: './app/app-webpage/app.webpage.html',
    directives: [HomePage, TeamPage, DirectoryPage, AboutUsPage, ContactUsPage, DisclaimerPage, SearchPage, ComponentPage, ModulePage, RouterOutlet, ROUTER_DIRECTIVES],
    providers: [ ROUTER_DIRECTIVES, ArticleDataService],
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
        path: '/modules',
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
    //test AI Page
    {
        path: 'articles',
        name: 'Articles-Page',
        component: ArticlePage
    },
    {
        path: 'team-roster',
        name: 'Teamroster-Page',
        component: TeamrosterPage
    },
    //new AsyncRoute({
    //    path: 'articles/history',
    //    loader: () => Promise.resolve(ArticlePageHistory),
    //    name: 'Articles-History-Page',
    //}),
    //new AsyncRoute({
    //    path: 'articles/about',
    //    loader: () => Promise.resolve(ArticlePageAbout),
    //    name: 'Articles-About-Page',
    //})
])

export class AppComponent implements OnInit {

    constructor(private _injector:Injector, private _params:RouteParams, private route:Router, private routeData:RouteData, private routerLink:RouterLink, private _globalFunctions:GlobalFunctions) {
    }

    ngOnInit() {
    }
}
