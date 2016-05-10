import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';

@Injectable()
export class LandingPageService {
  private _apiUrl: string = 'http://dev-homerunloyal-api.synapsys.us';
  constructor(public http: Http, private _globalFunctions: GlobalFunctions){}
  setToken(){
    var headers = new Headers();
    return headers;
  }
  getLandingPageService(){
    var headers = this.setToken();
    var fullUrl = this._apiUrl + "/landingPage/teams";
    return this.http.get(fullUrl, {
      headers: headers
    })
    .map(
      res => res.json()
    )
    .map(
      data => {
        return {
            league: this.landingData(data.data)
        };
      }
    )
  }// getLandingPageservice ends
  landingData(data){
    var self = this;
    var leagueArray = [];
    var teamArray = [];
    var dummyImg = "./app/public/placeholder-location.jpg";
    var dummyRoute = ['Team-page', {teamName:'yankees', teamId: 2796}];
    for(var league in data){//get each of the league given by data
      var divisionArray = [];
      for(var division in data[league]){//get each division within league data
        var div = data[league][division];
        div.forEach(function(val, index){//start converting team info
          val.route = "";//TODO
          val.imageData= {
            imageClass: "image-100",
            mainImage: {
              imageUrl: val.teamLogo,//TODO
              urlRouteArray: dummyRoute,
              hoverText: "<i style='font-size:30px;' class='fa fa-mail-forward'></i>",
              imageClass: "border-3"
            }
          }
        })//finish converting each team
        divisionArray.push({//once team conversion is finished push into each division
          displayName: division.toUpperCase(),
          dataArray: div
        });
      }
      leagueArray.push({//once all divisions are done push the league info into final array
        displayName:"<b>" + league.toUpperCase() + " LEAGUE</b> TEAMS<b>:</b>",
        dataArray:divisionArray
      });
    }
    return leagueArray;
  }
}// LandingPageService ends
