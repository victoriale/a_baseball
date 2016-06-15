import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {TitleInputData} from "../components/title/title.component";

declare var moment;


@Injectable()

export class DynamicWidgetCall {
  public apiUrl: string = "http://108.170.11.234:190/list_creator_api.php";
  listDisplayName: string;
  profHeader: TitleInputData;
  listData: Object;
  carData: Object;
  profile: string;
  pageLimit: number = 10;
  paginationParams: Object;

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
          if(data.data[0].partner_url.match(/^Player/)){
            this.profile = "player";
          }else if(data.data[0].partner_url.match(/^Team/)){
            this.profile = "team";
          }

          this.transformData(data);
          this.setupPagination();
          return {
            profHeader: this.profHeader,
            carData: this.transformCarData(data, this.profile),
            listData: this.detailedData(data, this.profile),
            pagination: this.paginationParams,
            listDisplayTitle: this.listDisplayName
          }
        },
        err =>{
          return err;
        }
      )
  }

  setupPagination(){
    this.paginationParams = {
      index: 1,
      max: 10,//default value will get changed in next function
      paginationType: 'module'
    }
  }

  transformData(data){// TRANSFORM DATA TO PLUG INTO COMPONENTS
    if(!data) return false;

    var originalData = data.data;
    var listData = [];
    var carouselData = [];

    this.listDisplayName = data ? data.title : "";

    this.profHeader= {
      // Old placeholder image:  http://www.myinvestkit.com/StateImages/Location_National.jpg
      imageURL : GlobalSettings.getSiteLogoUrl(),
      text1 : 'Last Updated: ' + moment(data.date).format('dddd, MMMM Do, YYYY'),
      text2 : ' United States',
      text3 : data.title,
      text4 : '',
      icon: 'fa fa-map-marker',
      hasHover: false
    };

    //grab data for the list
    originalData.forEach(function(val, i){
      //var test = 'Location-page|{"loc":"kansas-city-ks"}'.split("|");
      //let generatedUrl = globalFunc.parseToRoute(test);
      let generatedUrl = GlobalFunctions.parseToRoute(val['primary_url']);

      var listItem = {
        img :         val.img,
        list_sub :    val.list_sub,
        title :       val.title,
        subtype :     val.tag,
        numBed :      '',
        numBath:      '',
        date:         'Date',
        value:        val.value,
        tag:          val.tag,
        buttonName:   'View Profile',
        icon:         '',
        location:     '',
        market:       '',
        rank:         val.rank,
        desc:         val.desc,
        url:          "#",
        routePath:    generatedUrl
      };

      var carItem = {
        textDetails:    [
          val.title,
          "<small>" + val.list_sub+"</small>",
          "&nbsp;",
          val.value,
          "<small>"+val.tag+"</small>"
        ],
        callToAction:   "Want more detailed information?",
        buttonLabel:    "<span class='transparent'></span> <span>View Profile</span> <i class='fa fa-angle-right'></i>",
        index:          val.rank,
        imageUrl1:      val.img,
        linkUrl1:       "#",
        routePath:      generatedUrl
      }

      carouselData.push(carItem);
      listData.push(listItem);
    })//END of forEach

    //set to listData
    this.listData = listData;
    this.carData = carouselData;

  }//END OF TRANSFORM FUNCTION



  transformCarData(data, profile){
    let self = this;
    var carouselArray = [];
    var dummyImg = "/app/public/no-image.png";
    var dummyRoute = ['Error-page'];
    var currentYear = new Date().getFullYear();//TODO FOR POSSIBLE past season stats but for now we have lists for current year season
    var carData = data.data;
    //var carInfo = data.listInfo;

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

  //TODO replace data points for list page
  detailsData(mainP1,mainV1,mainUrl1,subP1,subV2,subUrl2, icon?, dataP3?,dataV3?,dataUrl3?){
    if(typeof dataP3 == 'undefined'){
      dataP3 = '';
    }
    if(typeof dataV3 == 'undefined'){
      dataV3 = '';
    }

    var details = [
      {
        style:'detail-small',
        data:dataP3,
        value:dataV3,
        url:dataUrl3,
      },
      {
        style:'detail-large',
        data:mainP1,
        value:mainV1,
        url:mainUrl1,
      },
      {
        style:'detail-medium',
        data:subP1,
        value:subV2,
        url:subUrl2,
        icon:icon,
      },
    ];
    return details;
  }


  detailedData(data,profile){//TODO replace data points for list page
    let self = this;
    var listDataArray = [];

    var currentYear = new Date().getFullYear();//TODO FOR POSSIBLE past season stats but for now we have lists for current year season

    var detailData = data.data;
    //var detailInfo = data.listInfo;
    detailData.forEach(function(val, index){
      if(profile == 'team'){
        var listData = {
          dataPoints: self.detailsData(
            "<a>"+val.title+"</a>",
            val.value,
            GlobalFunctions.parseToRoute(val['primary_url']),
            "<span class='text-master text-heavy'>"+val.list_sub+'</span>',
            val.tag,
            '',''),
          imageConfig: self.imageData("image-121","border-2",
            self.protocol + val.img,
            GlobalFunctions.parseToRoute(val['primary_url']),
            val.rank,
            'image-38-rank',
            'image-40-sub'),
          hasCTA:true,
          ctaDesc:'Want more info about this team?',
          ctaBtn:'',
          ctaText:'View Profile',
          ctaUrl: GlobalFunctions.parseToRoute(val['primary_url'])
        };
      }else if(profile == 'player'){
        var listData = {
          dataPoints: self.detailsData(
            "<a>"+val.title+"<a>",
            val.value,
            GlobalFunctions.parseToRoute(val['primary_url']),
            "<a class='text-master text-heavy'>"+val.list_sub+'</a>',
            val.tag,
            GlobalFunctions.parseToRoute(val['sub_img']['primary_url'])),
          imageConfig: self.imageData(
            "image-121",
            "border-2",
            self.protocol + val.img,
            GlobalFunctions.parseToRoute(val['primary_url']),
            val.rank,
            'image-38-rank',
            'image-40-sub',
            self.protocol + val['sub_img'].img,
            GlobalFunctions.parseToRoute(val['sub_img']['primary_url'])),
          hasCTA:true,
          ctaDesc: 'Want more info about this player?',
          ctaBtn: '',
          ctaText: 'View Profile',
          ctaUrl: GlobalFunctions.parseToRoute(val['primary_url'])
        };
      }
      listDataArray.push(listData);
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
    this.paginationParams['max'] = objData1.length - 1;
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
