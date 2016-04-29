import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';

export interface DataItem {
  label: string;
  labelCont?: string;
  value: string;  
}

export interface ProfileHeaderData {
    profileName: string;
    
    profileImageUrl: string;
    
    /**
     * Either player first name or team city
     */
    profileTitleFirstPart: string;
    
    /**
     * Either player last name or team name
     */
    profileTitleLastPart: string;
    
    lastUpdatedDate: Date;
    
    /**
     * HTML elements allowed
     */
    description: string; 
    topDataPoints: Array<DataItem>
    bottomDataPoints: Array<DataItem>;
}

@Injectable()
export class ProfileHeaderService {
  private _apiUrl: string = 'http://api2.joyfulhome.com';
  
  //Team Profile
  private _defaultData: ProfileHeaderData = {
    profileName: "Jayhawks",    
    profileImageUrl: "/app/public/profile_placeholder_large.png",
    profileTitleFirstPart: "Lawrance, KS", //first name or city
    profileTitleLastPart: "Jayhacks", //last name or team
    lastUpdatedDate: new Date(),
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
    topDataPoints: [
      { label: "Division", value: "East" },
      { label: "Rank", value: "12" },
      { label: "Record", value: "20 - 30" }
    ],
    bottomDataPoints: [
      { label: "Batting Average", labelCont: "for the current season", value: ".333" },
      { label: "Runs", labelCont: "for the current season", value: "30" },
      { label: "Home Runs", labelCont: "for the current season", value: "12" },
      { label: "Earned Run Average", labelCont: "for the current season", value: "5" }    
    ]
  }

  constructor(public http: Http){}

  getHeaderData(): Observable<ProfileHeaderData> {
    let url = this._apiUrl + '/profileHeader';
    return this.http.get(url)
        .map(res => res.json())
        .map(data => data.data);
  }
  
  getDefaultData(): Observable<ProfileHeaderData> {
    return Observable.of(this._defaultData);
  }
}