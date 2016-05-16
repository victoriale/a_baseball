import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';
import {SearchComponentResult, SearchComponentData} from '../components/search/search.component';
import {SearchPageInput} from '../modules/search-page/search-page.module';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions}  from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';
declare let Fuse: any;

@Injectable()
export class SearchService{
    public searchJSON: any = {
        players: [],
        teams: []
    };
    public searchAPI: string = GlobalSettings.getApiUrl() + '/landingPage/search';
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

    /*
     *  Functions for search component
     */

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

    /*
     * Functions for search page
     */

    getSearchPageData(query: string){
        let data = this.searchJSON;

        //Search for players and teams
        let playerResults = this.searchPlayers(query, data.players);
        let teamResults = this.searchTeams(query, data.teams);

        let searchResults = this.resultsToTabs(query, playerResults, teamResults);

        return Observable.of(searchResults);
    }

    //Convert players and teams to tabs format
    resultsToTabs(query, playerResults, teamResults){
        let searchPageInput: SearchPageInput = {
            searchComponent : {
                placeholderText: 'Search for a player or team...',
                hasSuggestions: false,
                initialText: query
            },
            heroImage: '/app/public/homePage_hero1.png',
            headerText: 'Discover The Latest In Baseball',
            subHeaderText: 'Find the Players and Teams you love.',
            query: query,
            tabData: [
                {
                    tabName: 'Player (' + playerResults.length + ')',
                    isTabDefault: true,
                    results: []
                },
                {
                    tabName: 'Team (' + teamResults.length + ')',
                    isTabDefault: false,
                    results: []
                }
            ]
        };

        playerResults.forEach(function(item){
            let playerName = item.playerFirstName + ' ' + item.playerLastName;
            let title = playerName + '\'s ' + 'Player Profile';
            let urlText = 'http://www.homerunloyal.com/';
            urlText += '<span class="text-heavy">player/' + GlobalFunctions.toLowerKebab(item.teamName) + '/' + GlobalFunctions.toLowerKebab(playerName) + '/' + item.playerId + '</span>';
            let url = MLBGlobalFunctions.formatPlayerRoute(item.teamName, playerName, item.playerId);
            let regExp = new RegExp(playerName, 'g');
            let description = item.playerDescription.replace(regExp, ('<span class="text-heavy">' + playerName + '</span>'));

            searchPageInput.tabData[0].results.push({
                title: title,
                urlText: urlText,
                url: url,
                description: description
            })
        });

        teamResults.forEach(function(item){
            let teamName = item.teamFirstName + ' ' + item.teamLastName;
            let title = teamName + '\'s ' + 'Team Profile';
            let urlText = 'http://www.homerunloyal.com/';
            urlText += '<span class="text-heavy">team/' + GlobalFunctions.toLowerKebab(teamName) + '/' + item.teamId;
            let url = MLBGlobalFunctions.formatTeamRoute(teamName, item.teamId);
            let regExp = new RegExp(teamName, 'g');
            let description = item.teamDescription.replace(regExp, ('<span class="text-heavy">' + teamName + '</span>'));

            searchPageInput.tabData[1].results.push({
                title: title,
                urlText: urlText,
                url: url,
                description: description
            })
        });

        return searchPageInput;
    }

    /*
     *  Search Functions used by both component and page
     */

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

}