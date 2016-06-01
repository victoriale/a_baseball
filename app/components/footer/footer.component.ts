import {Component, OnInit, OnChanges, Input} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from "@angular/router";
import {GlobalFunctions} from '../../global/global-functions';
import {MLBGlobalFunctions} from '../../global/mlb-global-functions';
import {Link, NavigationData} from '../../global/global-interface';

@Component({
    selector: 'footer-component',
    templateUrl: './app/components/footer/footer.component.html',
    directives: [ROUTER_DIRECTIVES],
    inputs: [],
    providers: [],
})
export class FooterComponent implements OnInit {
    public pageName: string = "HomeRunLoyal";//TODO
    teamDirectoryListings: Array<Link> = []

    playerDirectoryListings: Array<Link> = []

    mlbTeamListings: Array<Link> = [];

    //TODO: create footer links for mlb by specifying ID
    mlbTeams = [
        { name: "Arizona Diamondbacks", id: 2793},
        { name: "Atlanta Braves", id: 2796},
        { name: "Baltimore Orioles", id: 2799},
        { name: "Boston Red Sox", id: 2791},
        { name: "Chicago Cubs", id: 2795},
        { name: "Chicago White Sox", id: 2790},
        { name: "Cincinnati Reds", id: 2816},
        { name: "Cleveland Indians", id: 2809},
        { name: "Colorado Rockies", id: 2800},
        { name: "Detroit Tigers", id: 2797}
    ];

    ngOnInit() {
        this.teamDirectoryListings = GlobalFunctions.setupAlphabeticalNavigation("teams");
        this.playerDirectoryListings = GlobalFunctions.setupAlphabeticalNavigation("players");

        this.mlbTeams.forEach(team => {
           this.mlbTeamListings.push({
              text: team.name,
              route: MLBGlobalFunctions.formatTeamRoute(team.name, team.id.toString())
           });
        });
    }

}
