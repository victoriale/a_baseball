import {Component, OnInit, OnChanges, Input} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from "angular2/router";

@Component({
    selector: 'footer-component',
    templateUrl: './app/components/footer/footer.component.html',
    directives: [ROUTER_DIRECTIVES],
    inputs: [],
    providers: [],
})
export class FooterComponent implements OnInit {
  public pageName: string = "HomeRunLoyal"; //TODO
    ngOnInit() {
    }

    teamListings = [
        { "name": "A"},
        { "name": "B"},
        { "name": "C"},
        { "name": "D"},
        { "name": "E"},
        { "name": "F"},
        { "name": "G"},
        { "name": "H"},
        { "name": "I"},
        { "name": "J"},
        { "name": "K"},
        { "name": "L"},
        { "name": "M"},
        { "name": "N"},
        { "name": "O"},
        { "name": "P"},
        { "name": "Q"},
        { "name": "R"},
        { "name": "S"},
        { "name": "U"},
        { "name": "V"},
        { "name": "W"},
        { "name": "X"},
        { "name": "Y"},
        { "name": "Z"}
    ];
    mlbTeams = [
        { "name": "Arizona Diamondbacks"},
        { "name": "Atlanta Braves"},
        { "name": "Baltimore Orioles"},
        { "name": "Boston Red Sox"},
        { "name": "Chicago Cubs"},
        { "name": "Chicago White Sox"},
        { "name": "Cincinnati Reds"},
        { "name": "Cleveland Indians"},
        { "name": "Colorado Rockies"},
        { "name": "Detroit Tigers"}
    ];

}
