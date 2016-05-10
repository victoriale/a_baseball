import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';
import {RosterTableModel} from '../services/roster.data';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';

@Injectable()
export class RosterService {
  private _apiUrl: string = 'http://dev-homerunloyal-api.synapsys.us';
  constructor(public http: Http, private _globalFunctions: GlobalFunctions, private _mlbGF: MLBGlobalFunctions){}

  setToken(){
    var headers = new Headers();
    return headers;
  }
  getRosterservice(teamId, type){
    type = type.toLowerCase();
    var headers = this.setToken();
    var fullUrl = this._apiUrl + "/team/roster";
    if(typeof teamId != "undefined"){
      fullUrl += "/" + teamId;
    }
    if(typeof type != "undefined"){
      fullUrl += "/" + type;
    }
    console.log(fullUrl);
    return this.http.get(fullUrl, {
      headers: headers
    })
    .map(
      res => res.json()
    )
    .map(
      data => {
        console.log(data.data);
        return {
            title: this.getModuleTitle(data.data[0]),
            pageRouterLink: this.getLinkToPage(data.data[0]),
            carousel: this.carData(data.data),
            table: data.data
        };
      }
    )
  }//getRosterService ends

  private setupTabData(rosterTabs, data, maxRows?: number) {
    var table = new RosterTableModel("", data);
    let groupName = this.formatGroupName(standingsTab.conference, standingsTab.division);

    //Limit to maxRows, if necessary
    if ( maxRows !== undefined ) {
      table.rows = table.rows.slice(0, maxRows);
    }

    //Set display values
    table.rows.forEach((value, index) => {
      value.groupName = groupName;
      value.displayDate = this._globalFunctions.formatUpdatedDate(value.lastUpdatedDate, false);
      if ( value.teamId === undefined || value.teamId === null ) {
        value.teamId = index;
      }
    });

    //Table tabs
    let title = ""; // only include title if there are multiple tables.
    let tableData = new MLBStandingsTableData(title, standingsTab.conference, standingsTab.division, table);
    standingsTab.sections = [tableData];
    return standingsTab;
  }

  //BELOW ARE TRANSFORMING FUNCTIONS to allow the modules to match their corresponding components
  carData(data){
    // console.log('carousel transform',data);
    var self = this;
    var carouselArray = [];
    var dummyImg = "./app/public/placeholder-location.jpg";
    var dummyRoute = ['Disclaimer-page'];
    var curYear = new Date().getFullYear();
    data.forEach(function(val, index){
      var playerNum = "";
      var playerHeight = "";
      var playerWeight = "";
      var playerSalary = "";
      var andCheck = "";
      if(val.roleStatus == null){
        val.roleStatus = "N/A";
      }
      if(val.uniformNumber != null){
        playerNum = "is <b>#" + val.uniformNumber + "</b> and";
      } else {
        playerNum = "";
      }
      if(val.height != null){
        playerHeight = " stands at <b>" + val.height + "</b> tall";
      } else {
        playerHeight = "";
      }
      if(val.weight != null){
        playerWeight = ", weighing <b>" + val.weight + "</b> lbs";
      } else {
        playerWeight = "";
      }
      if(val.uniformNumber != null || val.height != null || val.weight != null){
        var andCheck = " and ";
      } else {
        var andCheck = " is ";
      }
      if(val.salary != null){
        playerSalary = andCheck + "making a salary of <b>" + val.salary + "</b>";
      } else {
        playerSalary = andCheck + "making a salary of <b>N/A</b>";
      }
      var Carousel = {
        index:'2',
        //imageData(mainImg, mainImgRoute, subImg, subRoute, rank)
        //TODO need to replace image data with actual image path when available
        imageConfig: self.imageData("image-150","border-large",dummyImg,dummyRoute,"image-50-sub",dummyImg,dummyRoute,index+1),
        description:[
          '<p><i class="fa fa-circle"></i> ' + curYear + ' TEAM ROSTER</p>',
          '<p><b>'+val.playerName+'</b></p>',
          '<p><b>'+ val.playerName+ '</b>, <b>'+val.roleStatus+'</b> for the <b>'+ val.teamName +'</b>,' + playerNum + playerHeight + playerWeight + playerSalary + '</p>',
          '<p>Last Updated On ' + val.lastUpdate + '</p>'
        ],
        footerInfo: {
          infoDesc: 'Interested in discovering more about this player?',
          text: 'View Profile',
          url: ['Disclaimer-page']
        }
      };
      carouselArray.push(Carousel);
    });
    // console.log('TRANSFORMED CAROUSEL', carouselArray);
    return carouselArray;
  }

  //function that returns information from api to an acceptable interface for images
  imageData(imageClass, imageBorder, mainImg, mainImgRoute, subImgClass?, subImg?, subRoute?, rank?){
    if(typeof mainImg =='undefined' || mainImg == ''){
      mainImg = "./app/public/placeholder-location.jpg";
    }
    if(typeof subImg =='undefined' || subImg == ''){
      mainImg = "./app/public/placeholder-location.jpg";
    }
    if(typeof rank == 'undefined' || rank == 0){
      rank = 0;
    }
    var image = {//interface is found in image-data.ts
        imageClass: imageClass,
        mainImage: {
            imageUrl: mainImg,
            urlRouteArray: mainImgRoute,
            hoverText: "<p>View</p><p>Profile</p>",
            imageClass: imageBorder
        },
        subImages: [
            {
                imageUrl: subImg,
                urlRouteArray: subRoute,
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: subImgClass + " image-round-lower-right"
            },
            {
                text: "#"+rank,
                imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
            }
        ],
    };
    return image;
  }

  getModuleTitle(pageParams): string {
    let moduletitle =" Team Roster";
    if ( pageParams.teamName !== undefined && pageParams.teamName !== null ) {
      moduletitle += pageParams.teamName + " - " + moduletitle;
    }
    return moduletitle;
  }

  getLinkToPage(pageParams) {
    console.log('Link',pageParams);
    var pageName = "Team-roster-page";
    var pageValues = {
      teamName: this._globalFunctions.toLowerKebab(pageParams.teamName),
      teamId: pageParams.teamId
    };

    pageValues.teamName = this._globalFunctions.toLowerKebab(pageParams.teamName);

    return {
      infoDesc: "Want to see the full team roster?",
      text: "VIEW FULL ROSTER",
      url: [pageName, pageValues]
    };
  }

}
