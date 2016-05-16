export enum Conference { american, national } //to get string value: Conference[myValue], where myValues is a Conference value

export enum Division { east, west, central }  //to get string value: Division[myValue], where myValues is a Division value

export interface MLBPageParameters {
  conference?: Conference;
  division?: Division; 
  teamId?: number;
  teamName?: string;
  playerId? :number;
  playerName?: string;
}

export interface Link {
  route?: Array<any>;
  text: string;
}

export interface NavigationData {
  title: string;
  links: Array<Link>;
  moreLink?: Link;
}

//Used by Trending-Homes module
export interface PropertyListingInterface {
    listingID: string;
    listPrice: string;
    squareFeet: string;
    lotSize: string;
    listingDate: string;
    daysOnMarket: string;
    address: string;
    zipCode: string;
    city: string;
    state: string;
    imageCount: string;
    numBathrooms: string;
    numBedrooms: string;
    fullBathrooms: string;
    halfBathrooms: string;
    architecturalStyle: string;
    numFloors: string;
    hasBasement: string;
    listingImages: any;
    appliance: string;
    heating: string;
    exterior: string;
    roof: string;
}

/*BELOW IS ARTICLE MODULE TEST INTERFACE*/

export interface HeadlineData {
    event: number;
    displayHeadline: string;
    metaHeadline: string;
    dateline: string;
    article: string;
    commentHeader: string;
    leftColumn: {
        "about-the-teams": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "historical-team-statistics": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "last-matchup": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "starting-lineup-home": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "starting-lineup-away": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "injuries-home": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "injuries-away": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "upcoming-game": {
            displayHeadline: string;
            metaHeadline: string;
        };
    };
    rightColumn: {
        "pitcher-player-comparison": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "catcher-player-comparison": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "first-base-player-comparison": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "second-base-player-comparison": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "third-base-player-comparison": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "shortstop-player-comparison": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "left-field-player-comparison": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "center-field-player-comparison": {
            displayHeadline: string;
            metaHeadline: string;
        };
        "right-field-player-comparison": {
            displayHeadline: string;
            metaHeadline: string;
        };
    };
    home: {
        id: number;
        location: string;
        name: string;
        hex: string;
        logo: string;
        images: string;
        wins: number;
        losses: number;
    }
    away: {
        id: number;
        location: string;
        name: string;
        hex: string;
        logo: string;
        images: string;
        wins: number;
        losses: number;
    }
}


export interface ArticleData {
    displayHeadline?: string;
    metaHeadline?: string;
    dateline?: string;
    article?: string;
    commentHeader?: string;
}

export interface ArticleData {
    metaData: Array<{
        homeTeamId: string;
        awayTeamId: string;
        league: string;
        homeTeamName: string;
        awayTeamName: string;
        homeRecord: string;
        awayRecord: string;
        gameAlignment: string;
        startDateTime: string;
        hex: {
            homeColor: string;
            awayColor: string;
        }
        logos: {
            home: string;
            away: string;
        }
    }>;
    preGameReport: Array<{
        status: boolean;
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    midGameReport: Array<{
        status: boolean;
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    postGameReport: Array<{
        status: boolean;
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    inningReport3: Array<{
        status: boolean;
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    inningReport5: Array<{
        status: boolean;
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    inningReport7: Array<{
        status: boolean;
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    aboutTheTeams: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    historicalTeamStats: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    lastMatchUp: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    startingLineUp: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    outfieldLF: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    outfieldCF: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    outfieldRF: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    infield3B: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    infieldSS: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    infield2B: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    infield1B: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    pitcher: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    catcher: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    homeTeamInjuryReport: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    awayTeamInjuryReport: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    homeTeamStartingLineUp: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
    awayTeamStartingLineUp: Array<{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: any;
    }>;
}
/*ABOVE IS ARTICLE MODULE TEST INTERFACE*/
