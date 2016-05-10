import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';
import {SearchComponentData} from '../components/search/search.component';
declare let JsSearch: any;



@Injectable()
export class SearchService{
    public searchJSON: any;

    constructor(private http: Http){
        //Get initial search JSON data
        this.getSearchJSON();
    }

    //Function get search JSON object
    getSearchJSON(){
        return this.http.get('./app/private/search.json', {

            })
            .map(
                res => res.json()
            ).subscribe(
                data => {
                    this.searchJSON = data;
                }
            )
    }

    //Function used by search input to get suggestions dropdown
    getSearchDropdownData(term: string){
        let data = this.searchJSON;

        //Search for players and teams
        let playerResults = this.searchPlayers(term, data.players);
        let teamResults = this.searchTeams(term, data.teams);
        //Transform data to useable format
        let searchResults = this.resultsToDropdown(playerResults, teamResults);

        return Observable.of(searchResults);
    }

    //Function to search through players. Outputs array of players that match criteria
    searchPlayers(term, data){
        let search = new JsSearch.Search('playerId');
        search.addIndex('playerFirstName');
        search.addIndex('playerLastName');
        search.addDocuments(data);

        return search.search(term);
    }

    //Function to search through teams. Outputs array of teams that match criteria
    searchTeams(term, data){
        let search = new JsSearch.Search('teamId');
        search.addIndex('teamFirstName');
        search.addIndex('teamLastName');
        search.addDocuments(data);

        return search.search(term);
    }

    //Convert players and teams to needed dropdown array format
    resultsToDropdown(playerResults, teamResults){
        let searchArray: Array<SearchComponentData> = [];
        let count = 0, max = 4;

        for(let i = 0, length = teamResults.length; i < length; i++){
            //Exit loop if max dropdown count
            if(count >= max){
                break;
            }
            let item = teamResults[i];
            count++;
            searchArray.push({
                title: item.teamFirstName + ' ' + item.teamLastName,
                value: item.teamFirstName + ' ' + item.teamLastName,
                imageUrl: '',
                routerLink: []
            })
        }

        for(let i = 0, length = playerResults.length; i < length; i++){
            //Exit loop if max dropdown count
            if(count >= max){
                break;
            }
            count++;
            let item = playerResults[i];
            searchArray.push({
                title: '<span class="text-bold">' + item.playerFirstName + ' ' + item.playerLastName + '</span> - ' + item.teamName,
                value: item.playerFirstName + ' ' + item.playerLastName,
                imageUrl: '',
                routerLink: []
            })
        }

        return searchArray;
    }
}