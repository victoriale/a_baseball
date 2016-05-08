export interface Link {
  page?: string;
  pageParams?: any;
  text: string;
}

export interface NavigationData {
  title: string;
  links: Array<Link>;
  moreLink?: Link;
}

export interface PagingData {
  rangeText: string;
  currentPage: number;
  totalItems: number;
  totalPages: number;
  description: string;
}

export interface DirectoryItems {
  totalItems: number;
  items: Array<DirectoryProfileItem>
}

export interface DirectoryProfileItem {
  lastUpdated: Date;
  mainDescription: Array<Link>;
  subDescription: Array<string>;
}

export interface DirectoryModuleData {  
  pageName: string;
  breadcrumbList: Array<Link>;
  directoryListTitle: string;
  hasListings: boolean;
  noResultsMessage: string;
  listingItems: DirectoryItems;  
  listingsLimit: number;
  navigationData: NavigationData;
  pagingDescription: string;
  pageParams: any;
}