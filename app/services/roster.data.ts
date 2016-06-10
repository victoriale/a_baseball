import {TableModel, TableColumn} from '../components/custom-table/table-data.component';
import {CircleImageData} from '../components/images/image-data';
import {RosterTabData} from '../components/roster/roster.component';
import {SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
import {Conference, Division} from '../global/global-interface';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {RosterService} from './roster.service';

export interface TeamRosterData {
  imageUrl: string,
  teamId: string,
  teamName: string,
  playerName: string,
  playerFirstName:string,
  playerLastName: string,
  playerId: string,
  roleStatus: string,
  active: string,
  uniformNumber: string,
  playerHeadshot: string,
  backgroundImage: string;
  teamLogo: string,
  position:Array<string>,
  depth: string,
  weight: string,
  height: string,
  birthDate: string,
  city: string,
  area: string,
  country: string,
  heightInInches: string,
  age: string,
  salary: number,
  lastUpdate: string,
  /**
   * - Formatted from league and division values that generated the associated table
   */
  groupName?: string
  /**
   * - Formatted from the lastUpdatedDate
   */
  displayDate?: string;
}

export class MLBRosterTabData implements RosterTabData<TeamRosterData> {
  type: string;
  teamId: string;
  maxRows: number;
  title: string;
  isLoaded: boolean = false;
  hasError: boolean = false;
  errorMessage: string;
  tableData: RosterTableModel;

  constructor(private _service: RosterService, teamId: string, type: string, conference: Conference, maxRows: number) {
    this.type = type;
    this.teamId = teamId;
    this.maxRows = maxRows;
    this.errorMessage = "Sorry, there is no roster data available.";

    if ( this.type == "hitters" && conference == Conference.national ) {
      this.hasError = true;
      this.errorMessage = "This team is a National League team and has no designated hitters.";
    }

    switch ( type ) {
      case "full":      this.title = "Full Roster"; break;
      case "pitchers":  this.title = "Pitchers";    break;
      case "catchers":  this.title = "Catchers";    break;
      case "fielders":  this.title = "Fielders";    break;
      case "hitters":   this.title = "Hitters";     break;
    }
  }

  loadData() {
    if ( !this.tableData ) {
      if ( !this._service.fullRoster ) {
        this._service.getRosterTabData(this).subscribe(data => {
          //Limit to maxRows, if necessary
          var rows = this.filterRows(data);
          if ( this.maxRows !== undefined ) {
            rows = rows.slice(0, this.maxRows);
          }

          this.tableData = new RosterTableModel(rows);
          this.isLoaded = true;
          this.hasError = false;
        },
        err => {
          this.isLoaded = true;
          this.hasError = true;
          console.log("Error getting roster data", err);
        });
      }
      else {
        var rows = this.filterRows(this._service.fullRoster);
        this.tableData = new RosterTableModel(rows);
        this.isLoaded = true;
        this.hasError = false;
      }
    }
  }

  filterRows(data: any): Array<TeamRosterData> {
    if ( this.type != "full" ) {
      return data[this.type];
    }
    else {
      var rows = [];
      for ( var type in data ) {
        Array.prototype.push.apply(rows, data[type]);
      }
      return rows;
    }
  }

  convertToCarouselItem(val:TeamRosterData, index:number):SliderCarouselInput {
    var playerRoute = MLBGlobalFunctions.formatPlayerRoute(val.teamName,val.playerName,val.playerId);
    var teamRoute = MLBGlobalFunctions.formatTeamRoute(val.teamName,val.teamId);
    var curYear = new Date().getFullYear();

    var formattedHeight = MLBGlobalFunctions.formatHeightWithFoot(val.height);
    var formattedSalary = "N/A";
    if ( val.salary != null ) {
      formattedSalary = "$" + GlobalFunctions.nFormatter(Number(val.salary));
    }
    // var formattedroleStatus = val.roleStatus != null ? val.roleStatus : "N/A";

    var playerNum = val.uniformNumber != null ? ", <span class='text-heavy'>#" + val.uniformNumber + "</span>," : "";
    var playerHeight = val.height != null ? "<span class='text-heavy'>" + formattedHeight + "</span>, " : "";
    var playerWeight = val.weight != null ? "<span class='text-heavy'>" + val.weight + "</span> lbs " : "";
    var playerSalary = " makes <span class='text-heavy'>" + formattedSalary + "</span> per season.";

    // var coordinator = (val.uniformNumber != null || val.height != null || val.weight != null) ? " and " : " is ";

    var subheader =  curYear + ' TEAM ROSTER';
    var description = '<span class="text-heavy">' + val.playerName +
                      '</span> <span class="text-heavy">'+ playerNum +
                      '</span> plays for the <span class="text-heavy">' + val.teamName +
                      '</span>. The ' + playerHeight + playerWeight + val.position.join(', ') + playerSalary;
    return {
        index: index,
        backgroundImage: val.backgroundImage != null ? GlobalSettings.getImageUrl(val.backgroundImage) : null,
        imageConfig: this.carouselImage(GlobalSettings.getImageUrl(val.playerHeadshot), playerRoute, GlobalSettings.getImageUrl(val.teamLogo), teamRoute, val.uniformNumber),
        description: [
          "<div class='roster-car-subhdr'><i class='fa fa-circle'></i> " + subheader + "</div>",
          "<div class='roster-car-hdr'>" + val.playerName + "</div>",
          "<div class='roster-car-desc'>" + description + "</div>",
          "<div class='roster-car-date'>Last Updated On " + GlobalFunctions.formatUpdatedDate(val.lastUpdate) + "</div>"
        ],
        footerInfo: {
          infoDesc: 'Interested in discovering more about this player?',
          text: 'View Profile',
          url: MLBGlobalFunctions.formatPlayerRoute(val.teamName,val.playerName,val.playerId.toString()),
        }
    };
  }

  //function that returns information from api to an acceptable interface for images
  carouselImage(mainImg: string, mainImgRoute: Array<any>, subImg: string, subRoute: Array<any>, carouselNum:string){
    if(!mainImg || mainImg == ''){
      mainImg = "./app/public/placeholder-location.jpg";
    }
    if(!subImg || subImg == ''){
      subImg = "./app/public/placeholder-location.jpg";
    }
    if(carouselNum == null){
      carouselNum = "0";
    }
    var image = {//interface is found in image-data.ts
        imageClass: "image-150",
        mainImage: {
            imageUrl: mainImg,
            urlRouteArray: mainImgRoute,
            hoverText: "<p>View</p><p>Profile</p>",
            imageClass: "border-large"
        },
        subImages: [
            {
                imageUrl: subImg,
                urlRouteArray: subRoute,
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "image-50-sub image-round-lower-right"
            },
            {
                text: "#" + carouselNum,
                imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
            }
        ],
    };
    return image;
  }
}

export class RosterTableModel {
  columns: Array<TableColumn> = [{
      headerValue: "Player",
      columnClass: "image-column",
      key: "name"
    },{
      headerValue: "Pos.",
      columnClass: "data-column",
      isNumericType: true,
      key: "pos"
    },{
      headerValue: "Height",
      columnClass: "data-column",
      isNumericType: true,
      key: "ht"
    },{
      headerValue: "Weight",
      columnClass: "data-column",
      isNumericType: true,
      key: "wt"
    },{
      headerValue: "Age",
      columnClass: "data-column",
      isNumericType: true,
      key: "age"
    },{
      headerValue: "Salary",
      columnClass: "data-column",
      isNumericType: true,
      sortDirection: -1, //descending
      key: "sal"
    }
  ];

  rows: Array<TeamRosterData>;

  selectedKey:string = "";

  constructor(rows: Array<TeamRosterData>) {
    this.rows = rows;
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
  }

  setRowSelected(rowIndex:number) {
    if ( rowIndex >= 0 && rowIndex < this.rows.length ) {
      this.selectedKey = this.rows[rowIndex].playerId;
    }
    else {
      this.selectedKey = null;
    }
  }

  isRowSelected(item:TeamRosterData, rowIndex:number): boolean {
    return this.selectedKey == item.playerId;
  }

  getDisplayValueAt(item:TeamRosterData, column:TableColumn):string {
    let self = this;
    var s = "";
    switch (column.key) {
      case "name":
        s = item.playerLastName + ', ' + item.playerFirstName;
        break;

      case "pos":
        s = typeof item.position[0] == 'undefined' ? "N/A" : item.position.join(', ');
        break;

      case "ht":
        s = typeof item.height == 'undefined' ? "N/A" : MLBGlobalFunctions.formatHeight(item.height);
        break;

      case "wt":
        s = typeof item.weight == 'undefined' ? "N/A" : item.weight + " lbs.";
        break;

      case "age":
      s = typeof item.age == 'undefined' ? "N/A" : item.age.toString();
        break;

      case "sal":
        s = item.salary == null ? "N/A" : "$" + GlobalFunctions.nFormatter(Number(item.salary));
        break;
    }
    return s;
  }

  getSortValueAt(item:TeamRosterData, column:TableColumn):any {
    var s = null;
    switch (column.key) {
        case "name":
          s = item.playerName;
          break;

        case "pos":
          s = item.position != null ? item.position.toString() : null;
          break;

        case "ht":
          s = item.heightInInches != null ? Number(item.heightInInches) : null;
          break;

        case "wt":
          s = item.weight != null ? Number(item.weight) : null;
          break;

        case "age":
        s = item.age != null ? Number(item.age) : null;
          break;

        case "sal":
          s = item.salary != null ? Number(item.salary) : null;
          break;
      }
      return s;
  }

  getImageConfigAt(item:TeamRosterData, column:TableColumn):CircleImageData {
    if ( column.key === "name" ) {
      return {
          imageClass: "image-50",
          mainImage: {
            imageUrl: GlobalSettings.getImageUrl(item.playerHeadshot),
            imageClass: "border-2",
            urlRouteArray: MLBGlobalFunctions.formatPlayerRoute(item.teamName,item.playerName,item.playerId.toString()),
            hoverText: "<i class='fa fa-mail-forward'></i>",
          },
          subImages: []
        };
    }
    else {
      return undefined;
    }
  }

  hasImageConfigAt(column:TableColumn):boolean {
    return column.key === "name";
  }

  getRouterLinkAt(item:TeamRosterData, column:TableColumn):Array<any> {
    if ( column.key === "name" ) {
      return MLBGlobalFunctions.formatPlayerRoute(item.teamName,item.playerName,item.playerId.toString());
    }
    else {
      return undefined;
    }

  }

  hasRouterLinkAt(column:TableColumn):boolean {
    return column.key === "name";
  }
}
