import {Component, OnInit, OnChanges, Input} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from "angular2/router";
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
    
    teamDirectoryListings: Array<Link> = []
    
    playerDirectoryListings: Array<Link> = []
    
    mlbTeamListings: Array<Link> = [];
    
    //TODO: create footer links for mlb by specifying ID
    mlbTeams = [
        { name: "Arizona Diamondbacks", id: 0},
        { name: "Atlanta Braves", id: 0},
        { name: "Baltimore Orioles", id: 0},
        { name: "Boston Red Sox", id: 0},
        { name: "Chicago Cubs", id: 0},
        { name: "Chicago White Sox", id: 0},
        { name: "Cincinnati Reds", id: 0},
        { name: "Cleveland Indians", id: 0},
        { name: "Colorado Rockies", id: 0},
        { name: "Detroit Tigers", id: 0}
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
