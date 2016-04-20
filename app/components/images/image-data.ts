export interface ImageData {
  urlRouteArray?: Array<any>; //TODO make not 'any'
  imageUrl?: string;
  hoverText?: string; //Can be simple html
  text?: string;
  imageClass: string;
  //hoverImageUrl?: string;
}

export interface CircleImageData {
  mainImage: ImageData;
  subImages?: Array<ImageData>;
  //subImage?: ImageData; //TODO: lower-right
  //rank?: number;  
  imageClass: string;
}