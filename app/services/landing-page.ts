import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';

@Injectable()
export class LandingPageService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  constructor(public http: Http, private _mlbGlobalFunctions: MLBGlobalFunctions){}
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
    for(var league in data){//get each of the league given by data
      var divisionArray = [];
      for(var division in data[league]){//get each division within league data
        var div = data[league][division];
        div.forEach(function(val, index){//start converting team info
          val.teamFirstName = val.teamFirstName.toUpperCase();
          val.teamLastName = val.teamLastName.replace("Diamondbacks","D-backs");
          var teamName = val.teamFirstName + ' ' + val.teamLastName;
          val.teamRoute = MLBGlobalFunctions.formatTeamRoute(teamName, val.teamId.toString());
          val.imageData= {
            imageClass: "image-100",
            mainImage: {
              imageUrl:  GlobalSettings.getImageUrl(val.teamLogo, GlobalSettings._deepDiveSm),
              urlRouteArray: MLBGlobalFunctions.formatTeamRoute(teamName, val.teamId.toString()),
              hoverText: "<i class='fa fa-mail-forward home-team-image-fa'></i>",// style='font-size:30px;'
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
        displayName:"<span class='text-heavy'>" + league.toUpperCase() + " LEAGUE</span> TEAMS<span class='text-heavy'>:</span>",
        dataArray:divisionArray
      });
    }
    return leagueArray;
  }
}// LandingPageService ends
