import {TableModel, TableColumn} from '../components/custom-table/table-data.component';
import {CircleImageData} from '../components/images/image-data';
import {TableTabData, TableComponentData} from '../components/standings/standings.component';
import {SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';

export interface TeamStandingsData {
  teamName: string,
  teamImageUrl: string,
  teamKey: string; //NEED!
  conferenceName: string,
  divisionName: string,
  lastUpdatedDate: Date,
  rank: number, //NEED!
  totalWins: number,
  totalLosses: number,
  winPercentage: number,
  streakType: string,
  streakCount: number,
  batRunsScored: number,
  pitchRunsAllowed: number,
  gamesBack: number,
  groupName?: string
}

export class StandingsTabData implements TableTabData<TeamStandingsData> {
  
  title: string;
  
  isActive: boolean;
  
  sections: Array<TableComponentData<TeamStandingsData>>;
  
  constructor(title: string, isActive: boolean, sections: Array<TableComponentData<TeamStandingsData>>) {
    this.title = title;
    this.isActive = isActive;
    this.sections = sections;
  } 

  convertToCarouselItem(item: TeamStandingsData, index:number): SliderCarouselInput {
    var teamRoute = ["Team-page", {
      "team": item.teamKey
    }];
    var year = "[YYYY]"; //TODO: this.currentYear
    var subheader = year + " Season " + item.groupName + " Standings";
    var description = item.teamName + " is currently <span class='text-heavy'>ranked " + item.rank + "</span>" +
                      " in the <span class='text-heavy'>" + item.groupName + "</span>, with a record of " +
                      "<span class='text-heavy'>" + item.totalWins + " - " + item.totalLosses + "</span>.";
    return {
      index: index,
      //backgroundImage: null, //optional
      description: [
        "<div class='standings-car-subhdr'>" + subheader + "</div>",
        "<div class='standings-car-hdr'>" + item.teamName + "</div>",
        "<div class='standings-car-desc'>" + description + "</div>",
        "<div class='standings-car-date'>Last Updated On [TBA]</div>"
      ], //TODO-CJP: use moment to format date 
      imageConfig: {
        imageClass: "image-150",
        mainImage: {
          imageClass: "border-10",
          urlRouteArray: teamRoute,
          imageUrl: item.teamImageUrl,
          hoverText: "<p>View</p><p>Profile</p>"
        },
        subImages: []
      }
    };
  }
}

export class StandingsTableData implements TableModel<TeamStandingsData> {
  title: string;
  
  columns: Array<TableColumn> = [{
      headerValue: "Team Name",
      columnClass: "image-column",
      key: "name"
    },{
      headerValue: "W",
      columnClass: "data-column",
      isNumericType: true,
      key: "w"
    },{
      headerValue: "L",
      columnClass: "data-column",
      isNumericType: true,
      key: "l"
    },{
      headerValue: "PCT",
      columnClass: "data-column",
      isNumericType: true,
      sortDirection: -1, //descending
      key: "pct"   
    },{
      headerValue: "GB",
      columnClass: "data-column",
      isNumericType: true,
      key: "gb"
    },{
      headerValue: "RS",
      columnClass: "data-column",
      isNumericType: true,
      key: "rs"
    },{
      headerValue: "RA",
      columnClass: "data-column",
      isNumericType: true,
      key: "ra"
    },{
      headerValue: "STRK",
      columnClass: "data-column",
      isNumericType: true,
      key: "strk"
    }];
  
  rows: Array<TeamStandingsData>;
  
  selectedIndex: number;
  
  constructor(title:string, rows: Array<TeamStandingsData>) {
    this.title = title;
    this.rows = rows;
    this.selectedIndex = 0;
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
  }
  
  isRowSelected(item:TeamStandingsData, rowIndex:number): boolean {
    return this.selectedIndex === rowIndex;
  }
  
  getDisplayValueAt(item:TeamStandingsData, column:TableColumn):string {
    var s = "";
    switch (column.key) {
      case "name": 
        s = item.teamName;
        break;
      
      case "w": 
        s = item.totalWins.toString();
        break;
      
      case "l": 
        s = item.totalLosses.toString();
        break;
      
      case "pct": 
        s = item.winPercentage.toString();
        break;
      
      case "gb": 
        s = item.gamesBack === 0 ? "-" : item.gamesBack.toString();
        break;
      
      case "rs": 
        s = item.batRunsScored.toString();
        break;
      
      case "ra": 
        s = item.pitchRunsAllowed.toString();
        break;
      
      case "strk": 
        var str = item.streakCount.toString();   
        s = (item.streakType == "loss" ? "L-" : "W-") + item.streakCount.toString(); 
        break;     
    }    
    return s;
  }
  
  getSortValueAt(item:TeamStandingsData, column:TableColumn):any {
    var o = null;
    switch (column.key) {
      case "name": 
        o = item.teamName;
        break;
      
      case "w": 
        o = item.totalWins;
        break;
      
      case "l": 
        o = item.totalLosses;
        break;
      
      case "pct": 
        o = item.winPercentage;
        break;
      
      case "gb": 
        o = item.gamesBack;
        break;
      
      case "rs": 
        o = item.batRunsScored;
        break;
      
      case "ra": 
        o = item.pitchRunsAllowed;
        break;
      
      case "strk": 
        var str = item.streakCount.toString();   
        o = (item.streakType == "loss" ? "L-" : "W-") + ('0000' + str).substr(str.length); //pad with zeros 
        break;     
    }    
    return o;
  }
  
  getImageConfigAt(item:TeamStandingsData, column:TableColumn):CircleImageData {
    if ( column.key === "name" ) {
      //TODO-CJP: store after creation? or create each time?
      return {
          imageClass: "image-50",
          mainImage: {
            imageUrl: item.teamImageUrl,
            placeholderImageUrl: "/app/public/profile_placeholder.png",
            imageClass: "border-2"
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
}