import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';
import {SearchComponentResult, SearchComponentData} from '../components/search/search.component';
import {MLBGlobalFunctions}  from '../global/mlb-global-functions';
import {GlobalSettings}  from '../global/global-settings';
declare let Fuse: any;

@Injectable()
export class SearchService{
    public searchJSON: any;
    public searchAPI: string = GlobalSettings.getApiUrl();

    constructor(private http: Http){
        //Get initial search JSON data
        this.getSearchJSON();
    }

    //Function get search JSON object
    getSearchJSON(){
        return this.http.get(this.searchAPI, {

            })
            .map(
                res => res.json()
            ).subscribe(
                data => {
                    this.searchJSON = data;
                },
                err => {
                    this.searchJSON = {
                        players: [],
                        teams: []
                    }
                }
            )
    }

    //Function used by search input to get suggestions dropdown
    getSearchDropdownData(term: string){
        //TODO: Wrap in async
        let data = this.searchJSON;

        //Search for players and teams
        let playerResults = this.searchPlayers(term, data.players);
        let teamResults = this.searchTeams(term, data.teams);
        //Transform data to useable format
        let searchResults = this.resultsToDropdown(playerResults, teamResults);
        //Build output to send to search component
        let searchOutput: SearchComponentData = {
            term: term,
            searchResults: searchResults
        };
        return Observable.of(searchOutput);
    }

    //Function to search through players. Outputs array of players that match criteria
    searchPlayers(term, data){
        let fuse = new Fuse(data, {
            //Fields the search is based on
            keys: ['playerFirstName', 'playerLastName'],
            //At what point does the match algorithm give up. A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything.
            threshold: 0.2
        });

        return fuse.search(term);
    }

    //Function to search through teams. Outputs array of teams that match criteria
    searchTeams(term, data){
        let fuse = new Fuse(data, {
            //Fields the search is based on
            keys: ['teamFirstName', 'teamLastName'],
            //At what point does the match algorithm give up. A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything.
            threshold: 0.2
        });

        return fuse.search(term);
    }

    //Convert players and teams to needed dropdown array format
    resultsToDropdown(playerResults, teamResults){
        let searchArray: Array<SearchComponentResult> = [];
        let count = 0, max = 4;

        for(let i = 0, length = teamResults.length; i < length; i++){
            //Exit loop if max dropdown count
            if(count >= max){
                break;
            }
            let item = teamResults[i];
            let teamName = item.teamFirstName + ' ' + item.teamLastName;
            count++;
            searchArray.push({
                title: teamName,
                value: teamName,
                imageUrl: '',
                routerLink: MLBGlobalFunctions.formatTeamRoute(teamName, item.teamId)
            })
        }

        for(let i = 0, length = playerResults.length; i < length; i++){
            //Exit loop if max dropdown count
            if(count >= max){
                break;
            }
            count++;
            let item = playerResults[i];
            let playerName = item.playerFirstName + ' ' + item.playerLastName;
            searchArray.push({
                title: '<span class="text-bold">' + playerName + '</span> - ' + item.teamName,
                value: playerName,
                imageUrl: '',
                routerLink: MLBGlobalFunctions.formatPlayerRoute(item.teamName, playerName, item.playerId)
            })
        }

        return searchArray;
    }

    //Function to build search route
    getSearchRoute(term: string){
        let searchRoute: Array<any>;
        //Build search Route
        if(typeof term !== 'undefined') {
            searchRoute = ['Search-page', {query: term}];
        }else{
            searchRoute = null;
        }

        return searchRoute !== null ? searchRoute : ['Error-page'];
    }
}