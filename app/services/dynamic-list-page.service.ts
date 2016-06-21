import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {TitleInputData} from "../components/title/title.component";
import {Link} from "../global/global-interface";
import {DetailListInput} from "../components/detailed-list-item/detailed-list-item.component";
import {ListPageService} from './list-page.service'

declare var moment;

@Injectable()

export class DynamicWidgetCall {
  public apiUrl: string = "http://108.170.11.234:190/list_creator_api.php";
  pageLimit: number = 10;

  public protocol: string = location.protocol;


  constructor(public http: Http) {
  }

  // Method to get data for the list for the dynamic widget
  // Inputs: tw - trigger word, sw - sort parameter, input - input value
  getWidgetData(tw, sw, input) {
    // If value is not needed, pass -1
    if (sw == null) { sw = -1; }
    if (input == null) { input = -1; }

    // Build the URL
    var url = this.apiUrl + "?tw=" + tw + "&sw=" + sw + "&input=" + input;

    return this.http.get(url, {
      })
      .map(
        res => res.json()
      )
      .map(
        data => {
          var profile;
          if(data.data[0].partner_url.match(/^Player/)){
            profile = "player";
          }else if(data.data[0].partner_url.match(/^Team/)){
            profile = "team";
          }

          var listData = this.detailedData(data, profile);

          var listDisplayName = data ? data.title : "";
          var paginationParams = {
            index: 1,
            max: listData.length - 1,
            paginationType: 'module'
          }
          var profHeader= {
            // Old placeholder image:  http://www.myinvestkit.com/StateImages/Location_National.jpg
            imageURL : GlobalSettings.getSiteLogoUrl(),
            text1 : 'Last Updated: ' + moment(data.date).format('dddd, MMMM Do, YYYY'),
            text2 : ' United States',
            text3 : data.title,
            text4 : '',
            icon: 'fa fa-map-marker',
            hasHover: false
          };
          return {
            profHeader: profHeader,
            carData: this.transformCarData(data, profile),
            listData: listData,
            pagination: paginationParams,
            listDisplayTitle: listDisplayName
          }
        },
        err =>{
          return err;
        }
      )
  }

  transformCarData(data, profile){
    let self = this;
    var carouselArray = [];
    var dummyImg = "/app/public/no-image.png";
    var dummyRoute = ['Error-page'];
    var currentYear = new Date().getFullYear();//TODO FOR POSSIBLE past season stats but for now we have lists for current year season
    var carData = data.data;

    if(carData.length == 0){
      var Carousel = {// dummy data if empty array is sent back
        index:'2',
        imageConfig: self.imageData("image-150","border-large",dummyImg,dummyRoute, 1, 'image-38-rank',"image-50-sub"),
        description:[
          '<p style="font-size:20px"><span class="text-heavy">Sorry, we currently do not have any data for this particular list</span><p>',
        ],
      };
      carouselArray.push(Carousel);
    }else{
      //if data is coming through then run through the transforming function for the module
      carData.forEach(function(val, index){
        if(profile == 'team'){
          var Carousel = {
            index:index,
            imageConfig: self.imageData(
              "image-150",
              "border-large",
              self.protocol + val.img,
              GlobalFunctions.parseToRoute(val['primary_url']),
              val.rank,
              'image-48-rank',
              'image-50-sub'),
            description:[
              '<br>',
              '<p style="font-size:22px"><span class="text-heavy">'+val.title+'</span></p>',
              '<p>' + val.list_sub +'</p>',
              '<br>',
              '<p style="font-size:22px"><b>'+val.value+'</b></p>',
              '<p style="font-size:16px"> '+val.tag+'</p>'
            ],
          };
          Carousel['footerInfo'] = {
            infoDesc:'Interested in discovering more about this team?',
            text:'View Profile',
            url:GlobalFunctions.parseToRoute(val['primary_url'])
          }
        }else if(profile == 'player'){
          var Carousel = {
            index:index,
            imageConfig: self.imageData(
              "image-150",
              "border-large",
              self.protocol + val.img,
              GlobalFunctions.parseToRoute(val['primary_url']),
              val.rank,
              'image-48-rank',
              'image-50-sub',
              self.protocol + val['sub_img'].img,
              GlobalFunctions.parseToRoute(val['sub_img'].primary_url)),
            description:[
              '<br>',
              '<p style="font-size:22px"><span class="text-heavy">'+val.title+'</span></p>',
              '<p>'+val.list_sub+'</p>',
              '<br>',
              '<p style="font-size:22px"><span class="text-heavy">'+val.value+'</span></p>',
              '<p style="font-size:16px"> '+val.tag+'</p>'
            ]
          };
          Carousel['footerInfo'] = {
            infoDesc:'Interested in discovering more about this player?',
            text:'View Profile',
            url: GlobalFunctions.parseToRoute(val['primary_url']),
          }
        }
        carouselArray.push(Carousel);
      });
    }
    //console.log('TRANSFORMED CAROUSEL', carouselArray);
    return this.modulePagination(carouselArray);
  }

  detailedData(data, profile:string): Array<DetailListInput>{
    if ( profile != 'team' && profile != 'player' ) {
      return []; //invalid profile type, so returning empty list;
    }
    var self = this;

    var listDataArray: DetailListInput[] = [];

    var currentYear = new Date().getFullYear();//TODO FOR POSSIBLE past season stats but for now we have lists for current year season

    var detailData = data.data;
    //var detailInfo = data.listInfo;
    listDataArray = detailData.map(function(val, index){
      var primaryRoute = GlobalFunctions.parseToRoute(val['primary_url']);

      var subRoute;
      var subImage;
      var imageConfig;
      var ctaDesc;
      if(profile == 'team') {
        ctaDesc = "Want more info about this team?";
      }
      else if ( profile == "player" ) {
        subRoute = GlobalFunctions.parseToRoute(val['sub_img']['primary_url']);
        subImage = self.protocol + val['sub_img'].img;
        ctaDesc = "Want more info about this player?";
      }
      
      return {
        dataPoints: ListPageService.detailsData(
            [ //main left text
              { route: primaryRoute, text: val.title }
            ],       
            val.value,   
            [ //sub left text
              { text: val.list_sub, class: 'text-master text-heavy', route: subRoute }
            ],
            val.tag),
        imageConfig: ListPageService.imageData("list", self.protocol + val.img, primaryRoute, val.rank, subImage, subRoute),
        hasCTA:true,
        ctaDesc:ctaDesc,
        ctaBtn:'',
        ctaText:'View Profile',
        ctaUrl: primaryRoute
      };
    });
    // console.log('TRANSFORMED List Data', listDataArray);
    return this.modulePagination(listDataArray);
  }//end of function


  modulePagination(inputData){
    var objCounter = 0;
    var objData1 = [];
    var self = this;
    inputData.forEach(function(item){
      if(typeof objData1[objCounter] == 'undefined' || objData1[objCounter] === null){//create paginated objData.  if objData array does not exist then create new obj array
        objData1[objCounter] = [];
        objData1[objCounter].push(item);
      }else{// otherwise push in data
        objData1[objCounter].push(item);
        // increment the objCounter to go to next array
        if(objData1[objCounter].length >= self.pageLimit){
          objCounter++;
        }
      }
    });
    return objData1;
  }



  /**
   *this function will have inputs of all required fields that are dynamic and output the full
   **/
  //TODO replace data points for list page
  imageData(imageClass, imageBorder, mainImg, mainImgRoute, rank, rankClass, subImgClass, subImg?, subRoute?){
    if(typeof mainImg =='undefined' || mainImg == ''){
      mainImg = "/app/public/no-image.png";
    }
    if(typeof subImg =='undefined' || subImg == ''){
      subImg = "/app/public/no-image.png";
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
        imageClass: imageBorder,
      },
      subImages: [
        {
          imageUrl: '',
          urlRouteArray: '',
          hoverText: '',
          imageClass: ''
        },
        {
          text: "#"+rank,
          imageClass: rankClass+" image-round-upper-left image-round-sub-text"
        }
      ],
    };
    if(typeof subRoute != 'undefined'){
      image['subImages'] = [];
      image['subImages'] = [
        {
          imageUrl: subImg,
          urlRouteArray: subRoute,
          hoverText: "<i class='fa fa-mail-forward'></i>",
          imageClass: subImgClass + " image-round-lower-right"
        },
        {
          text: "#"+rank,
          imageClass: rankClass+" image-round-upper-left image-round-sub-text"
        }
      ];
    }
    return image;
  }

}
