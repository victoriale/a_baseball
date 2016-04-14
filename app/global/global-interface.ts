/*BELOW IS MAGAZINE INTERFACE*/
export interface MagData{
    overview?: MagOverview;
    recommendations?: MagRecommendations;
    neighborhood?: MagNeighborhood;
    contact?: MagContact;
    info?: {
        schools?: MagSchools;
        demographics?: MagDemographics;
    };
    amenities?: MagAmenities;
}

export interface MagOverview {
    pageTitle?: string;
    menuTitle?: string;
    address?: address;
    price?: any;
    formattedPrice?: string;
    key?: string;
    content?: string[];
    photos?: string[];
}

export interface MagRecommendations {
    pageTitle?: string;
    menuTitle?: string;
    similar?: Array<{
        address?: address;
        key?: string;
        content?: string[];
        photos?: string[];
    }>;
}

export interface MagNeighborhood {
    pageTitle?: string;
    menuTitle?: string;
    key?: string;
    neighbors?: MagMap[];
    address?: any;
}

export interface MagContact {
    pageTitle?: string;
    menuTitle?: string;
    address?: address;
    price?: number;
    key?: string;
    content?: string[];
    photos?: string[];
}

export interface MagAmenities {
    pageTitle?: string;
    menuTitle?: string;
    address?: address;
    restaurant?: MagAmenity;
    grocery?: MagAmenity;
    bank?: MagAmenity;
    stockPhotos?: string;
}

export interface MagSchools {
    pageTitle?: string;
    menuTitle?: string;
    city?: string;
    content?: string[];
    stockPhotos?: string;
}

export interface MagDemographics {
    pageTitle?: string;
    menuTitle?: string;
    city?: string;
    content?: string[];
    stockPhotos?: string;
}

export interface address {
    fullStreetAddress?: string;
    city?: string;
    county?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    lat?: number;
    lng?: number;
}

export interface MagMap {
    key?: string;
    photos?: string[];
    address?: address;
    list_price?: number;
}

export interface MagAmenity {
    title?: string;
    content?: string[];
    photo?: string;
}

/*ABOVE IS MAGAZINE INTERFACE*/
export interface AmenitiesNearListingInterface {
    name: string;
    url: string;
    categories: string[];
    location: Object;
    display_address: string[];
    display_phone: string;
}

export interface SchoolDataInterface {
    schoolName: string;
    locationAddress: string;
    locationCity: string;
    locationState: string;
    locationZipcode: string;
    type: string;
    firstGradeEnrollment: string;
    sixthGradeEnrollment: string;
    ninthGradeEnrollment: string;
}

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
    listingPrice: string;
    listingStatus: string;
    officeNumber: number;
    originalLink: string;
    phoneNumber: number;
    squareFeet: string;
    zipCode: string;
    //Location data
    numberOfListings: string;
    averageListingPrice: string;
    averageRentalPrice: string;
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
