import {TableModel, TableColumn} from '../components/custom-table/table-data.component';
import {CircleImageData} from '../components/images/image-data';
import {RosterTableTabData, TableComponentData} from '../components/roster/roster.component';
import {SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
import {Conference, Division} from '../global/global-interface';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';

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
  teamLogo: string,
  position:string,
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
  displayDate?: string
}

export class RosterTabData {
  type: string;
  title: string;
  isActive: boolean;
  tableData: RosterTableModel;
  constructor(type: string, title: string, isActive: boolean) {
    this.type = type;
    this.title = title;
    this.isActive = isActive;
  }
  convertToCarouselItem(val, index){
    var self = this;
    var dummyImg = "./app/public/placeholder-location.jpg";
    var playerRoute = MLBGlobalFunctions.formatPlayerRoute(val.teamName,val.playerName,val.playerId);
    var teamRoute = MLBGlobalFunctions.formatTeamRoute(val.teamName,val.teamId);
    var curYear = new Date().getFullYear();
    var playerNum = "";
    var playerHeight = "";
    var playerWeight = "";
    var playerSalary = "";
    var andCheck = "";
    if(val.roleStatus == null){
      val.roleStatus = "N/A";
    }
    if(val.uniformNumber != null){
      playerNum = " is <b>#" + val.uniformNumber + "</b> and";
    } else {
      playerNum = "";
    }
    if(val.height != null){
      val.height = val.height.replace(/"/g, '').replace("-", "'") + '"';
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
      playerSalary = andCheck + "making a salary of <b>$" + GlobalFunctions.commaSeparateNumber(Number(val.salary)) + "</b>";
    } else {
      playerSalary = andCheck + "making a salary of <b>N/A</b>";
    }
    var Carousel = {
        index: index,
        //imageData(mainImg, mainImgRoute, subImg, subRoute, rank)
        imageConfig: self.imageData("image-150","border-large",GlobalSettings.getImageUrl(val.playerHeadshot),playerRoute,"image-50-sub",GlobalSettings.getImageUrl(val.teamLogo),teamRoute,index+1),
        description:[
          '<p style="font-size:12px;"><i class="fa fa-circle" style="color:#bc2027; padding-right: 5px;"></i> ' + curYear + ' TEAM ROSTER</p>',
          '<p style="font-size: 22px; font-weight: 800; padding:9px 0;">'+val.playerName+'</p>',
          '<p style="font-size: 14px; line-height: 1.4em;"><b style="font-weight:800;">'+ val.playerName+ '</b>, <b style="font-weight:800;">'+ val.position.join(', ') +'</b> for the <b style="font-weight:800;">'+ val.teamName +'</b>,' + playerNum + playerHeight + playerWeight + playerSalary + '</p>',
          '<p style="font-size: 10px; padding-top:9px;">Last Updated On ' + GlobalFunctions.formatUpdatedDate(val.lastUpdate) + '</p>'
        ],
        footerInfo: {
          infoDesc: 'Interested in discovering more about this player?',
          text: 'View Profile',
          url: MLBGlobalFunctions.formatPlayerRoute(val.teamName,val.playerName,val.playerId.toString()),
        }
    };
    return Carousel;
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
}

export class RosterTableModel {
  title: string;

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

  selectedKey:any = -1;

  constructor(title:string, rows: Array<TeamRosterData>) {
    this.title = title;
    this.rows = rows;
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
    else if ( rows.length > 0 ) {
      this.selectedKey = Number(rows[0].playerId);
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
        s = typeof item.position[0] == 'undefined' ? "N/A" : item.position.toString().replace(',', ', ');
        break;

      case "ht":
        s = typeof item.height == 'undefined' ? "N/A" : item.height.toString();
        break;

      case "wt":
        s = typeof item.weight == 'undefined' ? "N/A" : item.weight.toString() + " lbs.";
        break;

      case "age":
      s = typeof item.age == 'undefined' ? "N/A" : item.age.toString();
        break;

      case "sal":
        s = item.salary == null ? "N/A" : "$" + GlobalFunctions.commaSeparateNumber(Number(item.salary));
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
          s = item.position.toString();
          break;

        case "ht":
          s = item.heightInInches.toString();
          break;

        case "wt":
          s = item.weight.toString();
          break;

        case "age":
        s = item.age.toString();
          break;

        case "sal":
          s = Number(item.salary);
          break;
      }
      return s;
  }

  getImageConfigAt(item:TeamRosterData, column:TableColumn):CircleImageData {
    if ( column.key === "name" ) {
      //TODO-CJP: store after creation? or create each time?
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
