export interface AboutUsPageInterface {
    counties: string;
    listings: string;
    brokers: string;
    cities: string;
}

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

export interface List {
    title: string;
    location: string;
    bigImage: string;
    smallImage: any;
}

export interface HomePageData {
    citylocation: string;
    statelocation: string;
    cityarea: any;
}

export interface List2 {
    bigImage: string;
    city: string;
    list_name: string;
    list_addr: string;
    list_day: string;
    detail1: string;
    lotSize: string;
    unit1: string;
    detail2: string;
    unit2: string;
    price: string;
    price_name: string;
    smallImage: string[];
}

//Interface for Profile Header Module
export interface ProfileHeaderInterface {
    //Listing data
    address: string;
    agent: string;
    brokerageLogoURL: string;
    email: string;
    listingID: string;
    listingImage: string;
    listingPrice: number;
    listingStatus: string;
    officeNumber: number;
    originalLink: string;
    phoneNumber: number;
    squareFeet: number;
    zipCode: string;
    //Location data
    numberOfListings: number;
    averageListingPrice: number;
    averageRentalPrice: number;
    averageAge: string;
    locationImage: string;
    //Shared data
    city: string;
    state: string;
    lastUpdated: string;
}

//Interface for Featured List Module
export interface FeaturedListInterface {
    featured_list: Array<{
        address: string;
        bathrooms: string;
        bedrooms: string;
        listPrice: string;
        listingImage: string;
        listingName: string;
        neighborhood: string;
        zipcode: string;
    }>;
    url_mod: {
        "list-of-lists": string;
        top10Local: string;
        top10National: string;
    }
}
/*BELOW IS ARTICLE MODULE TEST INTERFACE*/
export interface ArticleData {
    metaData: [{
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
    }]
    preGameReport: [{
        status: boolean;
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }];
    midGameReport: [{
        status: boolean;
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
    postGameReport: [{
        status: boolean;
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
    inningReport3: [{
        status: boolean;
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
    inningReport5: [{
        status: boolean;
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
    inningReport7: [{
        status: boolean;
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
    aboutTheTeams: [{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
    historicalTeamStats: [{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
    lastMatchUp: [{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
    startingLineUp: [{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
    outfieldLF: [{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
    outfieldCF: [{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
    outfieldRF: [{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
    infield3B: [{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
    infieldSS: [{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
    infield2B: [{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
    infield1B: [{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
    pitcher: [{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
    catcher: [{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
    homeTeamInjuryReport: [{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
    awayTeamInjuryReport: [{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
    homeTeamStartingLineUp: [{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
    awayTeamStartingLineUp: [{
        photos: {
            url: string;
            index: number;
        }
        date: string;
        headline: string;
        content: string[];
    }]
}
/*ABOVE IS ARTICLE MODULE TEST INTERFACE*/