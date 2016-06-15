import {Component} from 'angular2/core';
import {RouteConfig, RouterOutlet, ROUTER_DIRECTIVES} from 'angular2/router';

import {TeamPage} from "../webpages/team-page/team.page";
import {MLBPage} from "../webpages/mlb-page/mlb.page";
import {PlayerPage} from "../webpages/player-page/player.page";
import {HomePage} from "../webpages/home-page/home-page.page";

import {AboutUsPage} from "../webpages/about-us-page/about-us.page";
import {ComponentPage} from "../webpages/component-page/component.page";

import {PartnerHeader} from "../global/global-service";

@Component({
    selector: 'my-house',
    templateUrl: './app/app-webpage/app.webpage.html',

    directives: [RouterOutlet, ComponentPage, ROUTER_DIRECTIVES],
    providers: [],
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
        path: '/profile/mlb',
        name: 'MLB-page',
        component: MLBPage,
    },
    {
        path: '/profile/team/:teamName/:teamId',
        name: 'Team-page',
        component: TeamPage,
    },
    {
        path: '/profile/player/:teamName/:fullName/:playerId',
        name: 'Player-page',
        component: PlayerPage,
    },
])

export class MyAppComponent {}
