import {TableModel, TableColumn, CellData} from '../components/custom-table/table-data.component';
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
  isTeamProfilePage: boolean;

  constructor(private _service: RosterService, teamId: string, type: string, conference: Conference, maxRows: number, isTeamProfilePage: boolean) {
    this.type = type;
    this.teamId = teamId;
    this.maxRows = maxRows;
    this.errorMessage = "Sorry, there is no roster data available.";
    this.isTeamProfilePage = isTeamProfilePage;

    if ( this.type == "hitters" && conference == Conference.national) {
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
          // this.hasError = false;
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
        // this.hasError = false;
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
    var teamRoute = this.isTeamProfilePage ? null : MLBGlobalFunctions.formatTeamRoute(val.teamName,val.teamId);
    var curYear = new Date().getFullYear();

    // var formattedHeight = MLBGlobalFunctions.formatHeightWithFoot(val.height);
    var formattedSalary = "N/A";
    if ( val.salary != null ) {
      formattedSalary = "$" + GlobalFunctions.nFormatter(Number(val.salary));
    }

    var playerNum = val.uniformNumber != null ? "<span class='text-heavy'>No. " + val.uniformNumber + "</span>," : "";
    var playerHeight = val.height != null ? "<span class='text-heavy'>" + val.height + "</span>, " : "";
    var playerWeight = val.weight != null ? "<span class='text-heavy'>" + val.weight + "</span> " : "";
    var playerSalary = " makes <span class='text-heavy'>" + formattedSalary + "</span> per year.";

    var playerLinkText = {
      route: playerRoute,
      text: val.playerName,
      class: 'text-heavy'
    }
    var teamLinkText = {
      route: teamRoute,
      text: val.teamName,
      class: 'text-heavy'
    }
    return SliderCarousel.convertToCarouselItemType1(index, {
      backgroundImage: GlobalSettings.getBackgroundImageUrl(val.backgroundImage, GlobalSettings._imgProfileMod),
      copyrightInfo: GlobalSettings.getCopyrightInfo(),
      subheader: [curYear + ' TEAM ROSTER'],
      profileNameLink: playerLinkText,
      description: [
          playerLinkText,
          " plays ", "<span class='text-heavy'>" + val.position.join(', '), "</span>",'for the ',
          teamLinkText,
          'wears <span class="text-heavy">'+ playerNum + '</span> is ' + playerHeight + playerWeight +" and "+ playerSalary
      ],
      lastUpdatedDate: GlobalFunctions.formatUpdatedDate(val.lastUpdate),
      circleImageUrl: GlobalSettings.getImageUrl(val.playerHeadshot, GlobalSettings._imgLgLogo),
      circleImageRoute: playerRoute,
      // subImageUrl: GlobalSettings.getImageUrl(val.teamLogo),
      // subImageRoute: teamRoute,
      //rank: val.uniformNumber
    });
  }
}

export class RosterTableModel implements TableModel<TeamRosterData> {
  columns: Array<TableColumn> = [{
      headerValue: "Player",
      columnClass: "image-column",
      key: "name",
      sortDirection: 1
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
      key: "sal"
    }
  ];

  rows: Array<TeamRosterData>;

  selectedKey: string = "";

  constructor(rows: Array<TeamRosterData>) {
    this.rows = rows;
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
  }

  setSelectedKey(key: string) {
    this.selectedKey = key;
  }

  getSelectedKey(): string {
    return this.selectedKey;
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

  getCellData(item:TeamRosterData, column:TableColumn): CellData {
    var display = null;
    var sort = null;
    var link: Array<any> = null;
    var imageUrl: string = null;
    var displayAsRawText = false;
    switch (column.key) {
      case "name":
        display = item.playerName;
        sort = item.playerLastName + ', ' + item.playerFirstName;
        link = MLBGlobalFunctions.formatPlayerRoute(item.teamName, item.playerName, item.playerId);
        imageUrl = GlobalSettings.getImageUrl(item.playerHeadshot, GlobalSettings._imgSmLogo);
        break;

      case "pos":
        display = typeof item.position[0] != null ? item.position.join(', ') : null;
        sort = item.position != null ? item.position.toString() : null;
        break;

      case "ht":
        display = item.height != null ? MLBGlobalFunctions.formatHeight(item.height) : null;
        displayAsRawText = true;
        sort = item.heightInInches != null ? Number(item.heightInInches) : null;
        break;

      case "wt":
        display = item.weight != null ? item.weight + " lbs." : null;
        sort = item.weight != null ? Number(item.weight) : null;
        break;

      case "age":
        display = item.age != null ? item.age.toString() : null;
        sort = item.age != null ? Number(item.age) : null;
        break;

      case "sal":
        display = item.salary != null ? "$" + GlobalFunctions.nFormatter(Number(item.salary)) : null;
        sort = item.salary != null ? Number(item.salary) : null;
        break;
    }
    if ( display == null ) {
      display = "N/A";
    }
    return new CellData(display, sort, link, imageUrl, displayAsRawText);
  }
}
