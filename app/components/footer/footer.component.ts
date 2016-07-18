import {Component, OnInit, Input} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from "@angular/router-deprecated";
import {GlobalFunctions} from '../../global/global-functions';
import {MLBGlobalFunctions} from '../../global/mlb-global-functions';
import {Link, NavigationData} from '../../global/global-interface';
import {GlobalSettings} from "../../global/global-settings";
import {DropdownDirectoryComponent} from '../dropdown-directory/dropdown-directory.component';

@Component({
    selector: 'footer-component',
    templateUrl: './app/components/footer/footer.component.html',
    directives: [ROUTER_DIRECTIVES, DropdownDirectoryComponent],
    inputs: [],
    providers: [],
})
export class FooterComponent implements OnInit {
    @Input() partner: string;
    public pageName: string;
    public homePageLinkName: string;
    public linkName: string;
    public currentUrl: string = window.location.href
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
    loadData(partner: string) {
      var checkPartner = GlobalSettings.getHomeInfo().isPartner;
      if(!partner && !checkPartner) {
          this.pageName = "Home Run Loyal";
          this.linkName = "HomeRunLoyal.com";
     } else {
          this.pageName = "My Home Run Zone";
          this.linkName = "MyHomeRunZone.com";
      }
    }

    ngOnInit() {
        this.loadData(this.partner);
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
