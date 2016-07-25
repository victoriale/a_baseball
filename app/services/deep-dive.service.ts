import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {DomSanitizationService} from '@angular/platform-browser';

declare var moment;
@Injectable()
export class DeepDiveService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  private _trendingUrl: string = GlobalSettings.getTrendingUrl();
  // private _apiToken: string = 'BApA7KEfj';
  // private _headerName: string = 'X-SNT-TOKEN';


  constructor(
    public http: Http,
    private _sanitizer: DomSanitizationService){}

  //Function to set custom headers
  setToken(){
      var headers = new Headers();
      //headers.append(this.headerName, this.apiToken);
      return headers;
  }

  getDeepDiveService(batchId: number, limit: number){//DATE
  //Configure HTTP Headers
  var headers = this.setToken();

  //date needs to be the date coming in AS EST and come back as UTC
  var callURL = this._apiUrl + '/' + 'article/batch/';
  if(typeof batchId == 'undefined'){
    callURL += "1";
  } else {
    callURL += batchId;
  }
  if(typeof limit == 'undefined'){
    callURL += "/25";
  } else {
    callURL += "/" + limit;
  }
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      // transform the data to YYYY-MM-DD objects from unix
      return data;
    })
  }
  getDeepDiveArticleService(articleID){//DATE
  //Configure HTTP Headers
  var headers = this.setToken();
  //date needs to be the date coming in AS EST and come back as UTC
  var callURL = this._apiUrl+'/'+ 'article/' + articleID;
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      // transform the data to YYYY-MM-DD objects from unix
      return data;
    })
  }
  getDeepDiveVideoService(articleID){//DATE
  //Configure HTTP Headers
  var headers = this.setToken();
  //date needs to be the date coming in AS EST and come back as UTC
  var callURL = this._apiUrl+'/'+ 'article/video/'+ articleID;
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      // transform the data to YYYY-MM-DD objects from unix
      return data;
    })
  }
  getDeepDiveVideoBatchService(numItems, startNum){//DATE
  //Configure HTTP Headers
  var headers = this.setToken();
  //date needs to be the date coming in AS EST and come back as UTC
  var callURL = this._apiUrl+'/'+ 'article/video/batch/'+ startNum +'/' + numItems ;
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      // transform the data to YYYY-MM-DD objects from unix
      return data;
    })
  }
  getDeepDiveBatchService(numItems){//DATE
  //Configure HTTP Headers
  var headers = this.setToken();
  //date needs to be the date coming in AS EST and come back as UTC
  var callURL = this._apiUrl+'/article'+ '/batch/2/'+numItems;
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {

      // transform the data to YYYY-MM-DD objects from unix
      return data;
    })
  }
  getdeepDiveData(deepDiveData, callback:Function, dataParam) {
  if(deepDiveData == null){
    deepDiveData = {};

  }else {
    }
  }


  getAiArticleData(){
    var headers = this.setToken();
    //this is the sidkeick url
    var callURL = this._trendingUrl;
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        return data;
      });
  }

  transformToBoxArticle(data){
    var boxArray = [];
    var sampleImage = "/app/public/placeholder_XL.png";
    data = data.data.slice(0,2);//TODO
    data.forEach(function(val, index){
      var Box = {
        keyword: val.keyword,
        date: GlobalFunctions.formatUpdatedDate(val.publishedDate),
        teaser: val.teaser,
        url: val.articleUrl != null ? val.articleUrl : '/',
        imageConfig:{
          imageClass: "image-288x180",
          mainImage:{
            imageUrl: val.imagePath != null ? GlobalSettings.getImageUrl(val.imagePath) : sampleImage
          }
        }
      }
      boxArray.push(Box);
    });
    return boxArray;
  }

getCarouselData(data, callback:Function) {
     this.getDeepDiveService(2, 25)
     .subscribe(data=>{
     //   console.log('before',data);
       var transformedData = this.carouselTransformData(data.data);
     //  console.log('after',transformedData);
      callback(transformedData);
     })
 }
 carouselTransformData(arrayData){

      var transformData = [];
      arrayData.forEach(function(val,index){
      //  console.log(val);
        let carData = {
          image_url: GlobalSettings.getImageUrl(val['imagePath']),
    //    image_url: this._sanitizer.bypassSecurityTrustStyle("url(" + GlobalSettings.getImageUrl(val['imagePath']), + ")"),
          title:  "<span> Today's News </span>" + val['title'],
          keyword: val['keyword'],
          teaser: val['teaser'].substr(0,250).replace('_',': ').replace(/<p[^>]*>/g, "") + "..."
        };
        transformData.push(carData);
      });

      return transformData;
  }


  transformToArticleRow(data){
    var articleStackArray = [];
    var sampleImage = "/app/public/placeholder_XL.png";
    var articleStackArray = [];
    data = data.data.slice(1,7);//TODO
    data.forEach(function(val, index){
      var s = {
          stackRowsRoute: MLBGlobalFunctions.formatSynRoute('story', val.id),
          keyword: val.keyword,
          publishedDate: GlobalFunctions.formatUpdatedDate(val.publishedDate),
          headline: val.title,
          provider1: val.author,
          provider2: "Published By: " + val.publisher,
          description: val.teaser,
          imageConfig: {
            imageClass: "image-100x75",
            mainImage:{
              imageUrl: val.imagePath != null ? GlobalSettings.getImageUrl(val.imagePath) : sampleImage
            }
          }
      }
      articleStackArray.push(s);
    });
    return articleStackArray;
  }

  transformToArticleStack(data){
    var sampleImage = "/app/public/placeholder_XL.png";
    var topData = data.data[0];//TODO
    var articleStackData = {
        articleStackRoute: MLBGlobalFunctions.formatSynRoute('story', topData.id),
        keyword: topData.keyword,
        date: GlobalFunctions.formatUpdatedDate(topData.publishedDate),
        headline: topData.title,
        provider1: topData.author,
        provider2: "Published By: " + topData.publisher,
        description: topData.teaser,
        imageConfig: {
          imageClass: "image-610x420",
          mainImage:{
            imageUrl: topData.imagePath != null ? GlobalSettings.getImageUrl(topData.imagePath) : sampleImage
          }
        }
    };
    return articleStackData;
  }

  transformToRecArticles(data){
    var articleTypes = [];
    var articles = [];
    var images = [];

    var homeId = data['meta-data']['current']['homeTeamId'];
    var awayId = data['meta-data']['current']['awayTeamId'];

    for(var obj in data){
      if(obj == "meta-data")continue;
      articleTypes.push(obj);
      articles.push(data[obj]);
    }

    var eventID = data['meta-data']['current']['eventId'];

    //set up the images array
    for(var obj in data['meta-data']['images']){
      // -1 on the length of images array to reserve one image for home/away specific article photo
      for(var i = 0; i < data['meta-data']['images'][obj].length - 1; i++){
        images.push(data['meta-data']['images'][obj][i]);
      }
    }

    // to mix up the images
    function shuffle(a) {
      var j, x, i;
      for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
      }
    }
    shuffle(images);

    var ret = [];
    for(var i = 0; i < articles.length; i++){
      ret[i] = articles[i];
      ret[i]['type'] = articleTypes[i];
      if(ret[i]['type'].split('-')[1] == 'home'){
        ret[i]['image'] = data['meta-data']['images'][homeId][data['meta-data']['images'][homeId].length - 1];
      }else if(ret[i]['type'].split('-')[1]  == 'away'){
        ret[i]['image'] = data['meta-data']['images'][awayId][data['meta-data']['images'][awayId].length - 1];
      }else{
        ret[i]['image'] = images[i];
      }
      ret[i]['keyword'] = ret[i]['sidekickTitle'].toUpperCase();
      ret[i]['bg_image_var'] = this._sanitizer.bypassSecurityTrustStyle("url(" + ret[i]['image'] + ")");
      ret[i]['new_date'] = MLBGlobalFunctions.convertAiDate(ret[i]['dateline']);
      ret[i]['event_id'] = eventID;
    }

    //build to format expected by html
    var _return = new Array(2);
    for(var i = 0; i < _return.length;i++){_return[i] = [];}
    for(var i = 0; i < ret.length; i++){
      if(i < 3){_return[0].push(ret[i]);}
      if(i >= 3 && i < 6){_return[1].push(ret[i]);}
    }
    return _return;
  }

  transformTileStack(data) {
    data = data.data;
    var lines = ['Find Your Favorite Player', 'Find Your Favorite Team', 'Check Out The Latest With the MLB'];
    var datastack = [];
      for(var i = 0; i < 3; i++){
        var j = Math.floor(Math.random() * 18) + 1;
        datastack[i] = data[i];
        datastack[i]['lines'] = lines[i];
        datastack[i]['image_url'] = GlobalSettings.getImageUrl(data[j]['imagePath']);
        //datastack[i]['image_url'] = data[i]['image_url'];
      }
      return datastack;
  }

  // getCarouselData(data, callback:Function) {
  //     this.getDeepDiveService()
  //     .subscribe(data=>{
  //     //   console.log('before',data);
  //       var transformedData = this.carouselTransformData(data);
  //     //    console.log('after',transformedData);
  //      callback(transformedData);
  //     })
  // }

  // getStackRowsData(data) {
  //     this.getDeepDiveService()
  //     .subscribe(data=>{
  //         console.log('before',data);
  //         var transformedData = this.stackrowsTransformData(data);
  //        //console.log('after',transformedData);
  //     })
  // }

}
