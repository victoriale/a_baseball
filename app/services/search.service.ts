import {Injectable} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';
import {SearchComponentResult, SearchComponentData} from '../components/search/search.component';
import {SearchPageInput} from '../modules/search-page/search-page.module';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions}  from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';
declare let Fuse: any;

@Injectable()
export class SearchService{
    public pageMax: number = 10;
    public searchJSON: any;
    public searchAPI: string = GlobalSettings.getApiUrl() + '/landingPage/search';
    constructor(private http: Http){
        //Get initial search JSON data
        this.getSearchJSON();
    }

    //Function get search JSON object
    getSearchJSON(){
      // console.log(this.searchAPI);
        return this.http.get(this.searchAPI, {

            })
            .map(
                res => res.json()
            ).subscribe(
                data => {
                    this.searchJSON = data;
                },
                err => {
                  console.log('ERROR search results');
                    this.searchJSON = null
                }
            )
    }
    //Function get search JSON object
    getSearch(){
      // console.log(this.searchAPI);
        return this.http.get(this.searchAPI, {

            })
            .map(
                res => res.json()
            ).map(
                data => {
                    return data;
                },
                err => {
                  console.log('ERROR search results');
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
            let teamName = item.teamName;
            count++;
            searchArray.push({
                title: teamName,
                value: teamName,
                imageUrl: {
                    imageClass: "image-43",
                    mainImage: {
                      imageUrl: GlobalSettings.getImageUrl(item.teamLogo, GlobalSettings._imgSmLogo),
                      hoverText: "<i class='fa fa-mail-forward search-text'></i>",
                      imageClass: "border-1",
                      urlRouteArray: MLBGlobalFunctions.formatTeamRoute(teamName, item.teamId),
                    }
                },
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
            let playerName = item.playerName;
            searchArray.push({
                title: '<span class="text-heavy">' + playerName + '</span> - ' + item.teamName,
                value: playerName,
                imageUrl: {
                    imageClass: "image-43",
                    mainImage: {
                      imageUrl: GlobalSettings.getImageUrl(item.imageUrl, GlobalSettings._imgSmLogo),
                      urlRouteArray: MLBGlobalFunctions.formatPlayerRoute(item.teamName, playerName, item.playerId),
                      hoverText: "<i class='fa fa-mail-forward search-text'></i>",
                      imageClass: "border-1"
                    }
                },
                routerLink: MLBGlobalFunctions.formatPlayerRoute(item.teamName, playerName, item.playerId)
            })
        }
        return searchArray;
    }

    //Function to build search route
    getSearchRoute(term: string){
        let searchRoute: Array<any>;
        //Build search Route
        if ( term ) {
            searchRoute = ['Search-page', {query: term}];
        }else{
            searchRoute = null;
        }
        return searchRoute !== null ? searchRoute : ['Error-page'];
    }

    /*
     * Functions for search page
     */

    getSearchPageData(router: Router, partnerId: string, query: string, data){
        // let data = this.searchJSON;
        //Search for players and teams
        let playerResults = this.searchPlayers(query, data.players);
        let teamResults = this.searchTeams(query, data.teams);

        let searchResults = this.resultsToTabs(router, partnerId, query, playerResults, teamResults);

        return searchResults;
    }

    //Convert players and teams to tabs format
    resultsToTabs(router: Router, partnerId: string, query, playerResults, teamResults){
      // console.log('results to Tabs', playerResults, teamResults);
      let self = this;
        let searchPageInput: SearchPageInput = {
            searchComponent : {
                placeholderText: 'Search for a player or team...',
                hasSuggestions: true,
                initialText: query
            },
            heroImage: '/app/public/homePage_hero1.png',
            headerText: 'Discover The Latest In Baseball',
            subHeaderText: 'Find the Players and Teams you love.',
            query: query,
            tabData: [
                {
                    tabName: 'Player (' + playerResults.length + ')',
                    isTabDefault: playerResults.length >= teamResults.length ? true : false,
                    results: [],
                    error:{
                      message:"Sorry we can't find a <span class='text-heavy'>Player Profile</span> matching your search term(s) ''<span class='query-blue'>"+query+"</span>'', please try your search again.",
                      icon:'noSearch'
                    },
                    pageMax:this.pageMax,
                    totalResults:playerResults.length,
                    paginationParameters: {
                        index: 1,
                        max: 10,//default value will get changed in next function
                        paginationType: 'module'
                    }
                },
                {
                    tabName: 'Team (' + teamResults.length + ')',
                    isTabDefault: teamResults.length > playerResults.length ? true : false,
                    results: [],
                    error:{
                      message:"Sorry we can't find a <span class='text-heavy'>Team Profile</span> matching your search term(s) '<span class='query-blue'>"+query+"</span>', please try your search again.",
                      icon:'noSearch'
                    },
                    pageMax:this.pageMax,
                    totalResults:teamResults.length,
                    paginationParameters: {
                        index: 1,
                        max: 10,//default value will get changed in next function
                        paginationType: 'module'
                    }
                }
            ]
        };

        let setTabDefault = searchPageInput.tabData
        var objCounter = 0;
        var objData1 = [];

        playerResults.forEach(function(item){
            let playerName = item.playerName;
            let title = GlobalFunctions.convertToPossessive(playerName) + " Player Profile";
            //TODO: use router functions to get URL
            // let urlText = 'http://www.homerunloyal.com/';
            // urlText += '<span class="text-heavy">player/' + GlobalFunctions.toLowerKebab(item.teamName) + '/' + GlobalFunctions.toLowerKebab(playerName) + '/' + item.playerId + '</span>';
            let route = MLBGlobalFunctions.formatPlayerRoute(item.teamName, playerName, item.playerId);
            let relativePath = router.generate(route).toUrlPath();
            if ( relativePath.length > 0 && relativePath.charAt(0) == '/' ) {
                relativePath = relativePath.substr(1);
            }
            let urlText = GlobalSettings.getHomePage(partnerId, false) + '/<span class="text-heavy">' + relativePath + '</span>';
            let regExp = new RegExp(playerName, 'g');
            let description = item.playerDescription.replace(regExp, ('<span class="text-heavy">' + playerName + '</span>'));

            if(typeof objData1[objCounter] == 'undefined' || objData1[objCounter] === null){//create paginated objData.  if objData array does not exist then create new obj array
              objData1[objCounter] = [];
              objData1[objCounter].push({
                  title: title,
                  urlText: urlText,
                  url: route,
                  description: description
              })
            }else{// otherwise push in data
              objData1[objCounter].push({
                  title: title,
                  urlText: urlText,
                  url: route,
                  description: description
              })
              if(objData1[objCounter].length >= self.pageMax){// increment the objCounter to go to next array
                objCounter++;
              }
            }
        });
        searchPageInput.tabData[0].results = objData1;
        searchPageInput.tabData[0].paginationParameters.max = searchPageInput.tabData[0].results.length;

        var objCounter = 0;
        var objData2 = [];

        teamResults.forEach(function(item){
            let teamName = item.teamName;
            let title = GlobalFunctions.convertToPossessive(teamName) + " Team Profile";
            //TODO: use router functions to get URL
            // let urlText = 'http://www.homerunloyal.com/';
            // urlText += '<span class="text-heavy">team/' + GlobalFunctions.toLowerKebab(teamName) + '/' + item.teamId;
            let route = MLBGlobalFunctions.formatTeamRoute(teamName, item.teamId);
            let relativePath = router.generate(route).toUrlPath();
            if ( relativePath.length > 0 && relativePath.charAt(0) == '/' ) {
                relativePath = relativePath.substr(1);
            }
            let urlText = GlobalSettings.getHomePage(partnerId, false) + '/<span class="text-heavy">' + relativePath + '</span>';
            let regExp = new RegExp(teamName, 'g');
            let description = item.teamDescription.replace(regExp, ('<span class="text-heavy">' + teamName + '</span>'));

            if(typeof objData2[objCounter] == 'undefined' || objData2[objCounter] === null){//create paginated objData.  if objData array does not exist then create new obj array
              objData2[objCounter] = [];
              objData2[objCounter].push({
                  title: title,
                  urlText: urlText,
                  url: route,
                  description: description
              })
            }else{// otherwise push in data
              objData2[objCounter].push({
                  title: title,
                  urlText: urlText,
                  url: route,
                  description: description
              })
              if(objData2[objCounter].length >= self.pageMax){// increment the objCounter to go to next array
                objCounter++;
              }
            }
        });

        searchPageInput.tabData[1].results = objData2;
        searchPageInput.tabData[1].paginationParameters.max = searchPageInput.tabData[1].results.length;
        return searchPageInput;
    }

    /*
     *  Search Functions used by both component and page
     */
     static _orderByComparatorPlayer(a:any, b:any):number{
       if ((a.score - b.score) == 0){
         if (a.item.playerName.toLowerCase() > b.item.playerName.toLowerCase()){return 1;} else {return -1;}
       }
       else {
         return a.score - b.score;
       }
     }
     static _orderByComparatorTeam(a:any, b:any):number{
       if ((a.score - b.score) == 0){
         if (a.item.teamName.toLowerCase() > b.item.teamName.toLowerCase()){return 1;} else {return -1;}
       }
       else {
         return a.score - b.score;
       }
     }
    //Function to search through players. Outputs array of players that match criteria
    searchPlayers(term, data){
        let fuse = new Fuse(data, {
            //Fields the search is based on
            keys: [{
              name: 'playerFirstName',
              weight: 0.5
            }, {
              name: 'playerLastName',
              weight: 0.3
            }, {
                name: 'playerName',
                weight: 0.2
            }],
            //At what point does the match algorithm give up. A threshold of 0.0 requires a perfect match (of both letters and location),
            // a threshold of 1.0 would match anything.
            threshold: 0.1,
            distance: 10,
            tokenize: false,
            sortFn: SearchService._orderByComparatorPlayer
        });

        return fuse.search(term);
    }

    //Function to search through teams. Outputs array of teams that match criteria
    searchTeams(term, data){
        let fuse = new Fuse(data, {
            //Fields the search is based on
            keys: ['teamName'],
            //At what point does the match algorithm give up. A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything.
            threshold: 0.2,
            shouldSort: true,
            sortFn: SearchService._orderByComparatorTeam
        });

        return fuse.search(term);
    }

}
