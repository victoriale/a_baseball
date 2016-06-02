import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Gradient} from '../global/global-gradient';

declare var moment;
@Injectable()
export class BoxScoresService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  // private _apiToken: string = 'BApA7KEfj';
  // private _headerName: string = 'X-SNT-TOKEN';

  constructor(public http: Http, private _globalFunc: GlobalFunctions){

  }

  //Function to set custom headers
  setToken(){
      var headers = new Headers();
      //headers.append(this.headerName, this.apiToken);
      return headers;
  }

  getBoxScoresService(profile, date, teamId?){
  //Configure HTTP Headers
  var headers = this.setToken();

  var callURL = this._apiUrl+'/'+profile+'/boxScores/2814/2016-05-23';

  console.log(callURL);
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      console.log(data.data);

      return {
        schedule: this.formatSchedule(data.data),
        fullData: data.data
      };
    })
  }

  transformBoxScores(boxScores){
    var newBoxScores = {};
    for(var dates in boxScores){
        var dayDate = dates.split(' ')[0];
        if(typeof newBoxScores[dayDate] == 'undefined'){
           newBoxScores[dayDate] = [];
           newBoxScores[dayDate].push(boxScores[dates]);
        }
    }
  }

  formatSchedule(data){
    console.log(data);
    return data;
  }

  formatGameInfo(data){
    console.log(data);
    return data;
  }

  formatArticle(data){
    console.log(data);
    return data;
  }

  formatScoreBoard(data){
    console.log(data);
    return data;
  }

}
