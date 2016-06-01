/*
 GLOBAL SERVICE INDEX

 @LOCATIONPROFILE
 _@BATCH-1
 _@BATCH
 */
import {Injectable} from 'angular2/core';
import {ArticleData} from "./global-interface";
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from './global-functions';
import {Observable} from "rxjs/Observable";
import {Router} from "angular2/router";
import {GlobalSettings} from "./global-settings";
import {MLBGlobalFunctions} from "./mlb-global-functions";
import {TitleInputData} from "../components/title/title.component";

declare var moment: any;

@Injectable()

export class PartnerHeader {
  public protocolToUse: string = (location.protocol == "https:") ? "https" : "http";
  public apiUrl: string = '://dev-real-api.synapsys.us/listhuv/?action=get_partner_data&domain=';

  constructor(public http: Http) {

  }

  //API for listing profile
  getPartnerData(partner_id) {

    // var partnerID = partner_id.split('-');
    //
    // //handles some cases where domain registries are different
    // var combinedID = [];
    // var domainRegisters = [];
    // for(var i = 0; i < partnerID.length; i++){
    //     if(partnerID[i] == "com" || partnerID[i] == "gov" || partnerID[i] == "net" || partnerID[i] == "org" || partnerID[i] == "co"){
    //       combinedID.push(partnerID[i]);
    //     }else{
    //       domainRegisters.push(partnerID[i]);
    //     }
    // }
    //
    // partner_id = domainRegisters.join('-')+ "." + combinedID.join('.');

    var fullUrl = this.protocolToUse + this.apiUrl + partner_id;
    return this.http.get(fullUrl, {
    })
    .map(
      res => res.json()
    )
    .map(
      data => {
        return data;
      }
    )
  }
}

@Injectable()

export class DynamicWidgetCall {
  public apiUrl: string = "http://108.170.11.234:190/list_creator_api.php";
  profHeader: TitleInputData;
  listData: Object;
  carData: Object;
  profile: string;
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
        //console.log("data2",data.data[0].partner_url);
        if(data.data[0].partner_url.match(/^Player/)){
          this.profile = "player";
        }else if(data.data[0].partner_url.match(/^Team/)){
          this.profile = "team";
        }

        this.transformData(data);
        return {
          profHeader: this.profHeader,
          carData: this.transformCarData(data, this.profile),
          listData: this.detailedData(data, this.profile),
          pagination: {pageCount:data.data/this.pageLimit}
        }
      },
      err =>{
        return err;
      }
  )
  }

  transformData(data){// TRANSFORM DATA TO PLUG INTO COMPONENTS
    if(!data) return false;

    var originalData = data.data;
    var listData = [];
    var carouselData = [];

    this.profHeader= {
      // Old placeholder image:  http://www.myinvestkit.com/StateImages/Location_National.jpg
      imageURL : '/app/public/mainLogo.png',
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
        title :       "<i class='fa fa-map-marker'></i> " + val.title,
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
          "<i class='fa fa-map-marker'></i> " + val.title,
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
    // console.log('original carousel data', data);
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
              '<p><i class="fa fa-map-marker text-master"></i> '+ val.list_sub +'</p>',
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
    return carouselArray;
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
            "<a class='text-master text-heavy'>"+val.list_sub+'</a>',
            val.tag,
            '','fa fa-map-marker'),
          imageConfig: self.imageData("image-121","border-2",
            self.protocol + val.img,
            GlobalFunctions.parseToRoute(val['parimary_url']),
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
    return listDataArray;
  }//end of function



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

@Injectable()
export class Articles {
  getArticles() {
    var articleData:ArticleData[] = [
      {
        metaData: [{
          homeTeamId: "123",
          awayTeamId: "321",
          league: "MLB",
          homeTeamName: "New York Yankees",
          awayTeamName: "Boston Red Sox",
          homeRecord: "5 - 1",
          awayRecord: "1 - 5",
          gameAlignment: "home",
          startDateTime: "04/15/2016 1900",
          hex: {
            homeColor: "#1F2F6B",
            awayColor: "#C91B34",
          },
          logos: {
            home: "http://www.sports-logos-screensavers.com/user/New_York_Yankees.jpg",
            away: "http://fullhdpictures.com/download.php?file=http://fullhdpictures.com/wp-content/uploads/2015/10/Boston-Red-Sox.jpg",
          },
        }],
        preGameReport: [{
          status: true,
          photos: {
            url: "http://cdnph.upi.com/sv/b/upi/UPI-5051455995474/2016/1/c904f0af00b25a07ef7e2cd01254c521/New-York-Yankees-spring-preview-Stronger-bullpen-may-bring-improvement.jpg",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the Articles Module. derp1",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        midGameReport: [{
          status: false,
          photos: {
            url: "http://cdnph.upi.com/sv/b/upi/UPI-5051455995474/2016/1/c904f0af00b25a07ef7e2cd01254c521/New-York-Yankees-spring-preview-Stronger-bullpen-may-bring-improvement.jpg",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the Articles Module. derp2",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        inningReport3: [{
          status: false,
          photos: {
            url: "http://cdn.fansided.com/wp-content/blogs.dir/210/files/2016/01/michael-pineda-joe-girardi-mlb-houston-astros-new-york-yankees.jpg",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the Articles Module. derp4",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        inningReport5: [{
          status: false,
          photos: {
            url: "http://i.dailymail.co.uk/i/pix/2013/05/21/article-2328496-19DBA433000005DC-706_634x422.jpg",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the Articles Module. derp5",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        inningReport7: [{
          status: false,
          photos: {
            url: "http://cache1.asset-cache.net/gc/53074243-jason-giambi-of-the-new-york-yankees-trots-gettyimages.jpg?v=1&c=IWSAsset&k=2&d=OCUJ5gVf7YdJQI2Xhkc2QKfUIsRBDCcqaXHe8w9%2F3FvMyTbEX5b21y78kGNqIsuqUv%2Bv66%2BRtSCW8fXRdj2j4g%3D%3D",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the Articles Module. derp6",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        postGameReport: [{
          status: false,
          photos: {
            url: "http://www2.pictures.zimbio.com/gi/New+York+Yankees+v+Detroit+Tigers+IXsXuIsMZLpl.jpg",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the Articles Module. derp3",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        aboutTheTeams: [{
          photos: {
            url: "https://static.rukkus.com/images/performer/headshots/boston-red-sox-tickets.jpg.870x570_q70_crop-smart_upscale.jpg",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the left side of the Articles Module. derpy1",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        historicalTeamStats: [{
          photos: {
            url: "http://images.forbes.com/media/lists/33/2010/boston-red-sox.jpg",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the left side of the Articles Module. derpy2",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        lastMatchUp: [{
          photos: {
            url: "http://media.gettyimages.com/photos/david-ortiz-of-the-boston-red-sox-watches-the-flight-of-the-ball-the-picture-id85854086",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the left side of the Articles Module. derpy3",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        startingLineUp: [{
          photos: {
            url: "http://cache3.asset-cache.net/gc/469610884-sandy-leon-of-the-boston-red-sox-hits-a-gettyimages.jpg?v=1&c=IWSAsset&k=2&d=GkZZ8bf5zL1ZiijUmxa7QXBMYnM2zdtNPeqNvPaxfQ93pvbZ2hWWYvIihUR9EEE%2BYxzI4%2F%2Fo6lldtpsYkaPTZBbJmLN2EvlXdihBIdHZ8S8%3D",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the right side of the Articles Module. derpy4",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        outfieldLF: [{
          photos: {
            url: "http://images.forbes.com/media/lists/33/2010/boston-red-sox.jpg",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the right side. derpderp1",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        outfieldCF: [{
          photos: {
            url: "http://media.gettyimages.com/photos/david-ortiz-of-the-boston-red-sox-watches-the-flight-of-the-ball-the-picture-id85854086",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the right side. derpderp2",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        outfieldRF: [{
          photos: {
            url: "http://images.forbes.com/media/lists/33/2010/boston-red-sox.jpg",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the right side. derpderp3",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        infield3B: [{
          photos: {
            url: "http://images.forbes.com/media/lists/33/2010/boston-red-sox.jpg",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the right side. derpderp4",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        infieldSS: [{
          photos: {
            url: "http://images.forbes.com/media/lists/33/2010/boston-red-sox.jpg",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the right side. derpderp5",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        infield2B: [{
          photos: {
            url: "http://media.gettyimages.com/photos/david-ortiz-of-the-boston-red-sox-watches-the-flight-of-the-ball-the-picture-id85854086",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the right side. derpderp6",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        infield1B: [{
          photos: {
            url: "http://images.forbes.com/media/lists/33/2010/boston-red-sox.jpg",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the right side. derpderp7",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        pitcher: [{
          photos: {
            url: "http://media.gettyimages.com/photos/david-ortiz-of-the-boston-red-sox-watches-the-flight-of-the-ball-the-picture-id85854086",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the right side. derpderp8",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        catcher: [{
          photos: {
            url: "http://images.forbes.com/media/lists/33/2010/boston-red-sox.jpg",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the right side. derpderp9",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        homeTeamInjuryReport: [{
          photos: {
            url: "http://cdnph.upi.com/sv/b/upi/UPI-2661459398773/2016/1/81809bbfda40ce0ca319c6e00ff42d8f/New-York-Yankees-Andrew-Miller-fractures-wrist.jpg",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the left side of the Articles Module. derpy5",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        awayTeamInjuryReport: [{
          photos: {
            url: "http://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Red_Sox_094_Jacoby_Ellsbury.jpg/680px-Red_Sox_094_Jacoby_Ellsbury.jpg",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the left side of the Articles Module. derpy6",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        homeTeamStartingLineUp: [{
          photos: {
            url: "https://elyriact.smugmug.com/Sports/Pro-baseball/Indians-April-9-2013/i-R4cPgct/0/M/Yankees_Indians_Baseball__ctnews@chroniclet.com_6-M.jpg",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the left side of the Articles Module. derpy7",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        awayTeamStartingLineUp: [{
          photos: {
            url: "http://media.gettyimages.com/photos/kevin-millar-of-the-boston-red-sox-swings-at-a-new-york-yankees-pitch-picture-id52989440",
            index: 1,
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the left side of the Articles Module. derpy8",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
      }
    ];
    return Promise.resolve(articleData);
  }
}
