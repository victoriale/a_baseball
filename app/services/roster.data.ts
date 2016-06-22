import {TableModel, TableColumn} from '../components/custom-table/table-data.component';
import {CircleImageData} from '../components/images/image-data';
import {RosterTabData} from '../components/roster/roster.component';
import {SliderCarousel,SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
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
    var rows: Array<TeamRosterData>;
    if ( this.type != "full" ) {
      rows = data[this.type];
    }
    else {
      rows = [];
      for ( var type in data ) {
        data[type].forEach(player => {
          if ( rows.filter(row => row.playerId == player.playerId).length == 0 ) {
            rows.push(player);
          }
        });
      }      
    }
    rows = rows.sort((a, b) => {
      return Number(b.salary) - Number(a.salary);
    });
    if ( this.maxRows !== undefined ) {
      rows = rows.slice(0, this.maxRows);
    }
    return rows;
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

    var playerNum = val.uniformNumber != null ? ", <span class='text-heavy'>#" + val.uniformNumber + "</span>," : "";
    var playerHeight = val.height != null ? "<span class='text-heavy'>" + formattedHeight + "</span>, " : "";
    var playerWeight = val.weight != null ? "<span class='text-heavy'>" + val.weight + "</span> lbs " : "";
    var playerSalary = " makes <span class='text-heavy'>" + formattedSalary + "</span> per season.";

    var playerLinkText = {
      route: playerRoute,
      text: val.playerName
    }
    var teamLinkText = {
      route: teamRoute,
      text: val.teamName
    }
    return SliderCarousel.convertToSliderCarouselItem(index, {
      backgroundImage: val.backgroundImage != null ? GlobalSettings.getImageUrl(val.backgroundImage) : null,
      subheader: [curYear + ' TEAM ROSTER'],
      profileNameLink: playerLinkText,
      description: [
          '<span class="text-heavy">',
          playerLinkText,
          '</span> <span class="text-heavy">'+ playerNum + '</span> plays for the ',
          teamLinkText,
          '. The ' + playerHeight + playerWeight + "<span class='text-heavy'>" + val.position.join(', ') + "</span>" + playerSalary
      ],
      lastUpdatedDate: GlobalFunctions.formatUpdatedDate(val.lastUpdate),
      circleImageUrl: GlobalSettings.getImageUrl(val.playerHeadshot),
      circleImageRoute: playerRoute,
      // subImageUrl: GlobalSettings.getImageUrl(val.teamLogo),
      // subImageRoute: teamRoute,
      rank: val.uniformNumber
    });
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
