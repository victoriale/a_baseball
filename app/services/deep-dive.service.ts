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
  private _articleUrl: string = GlobalSettings.getArticleUrl();
  private _recUrl: string = GlobalSettings.getRecUrl();
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

  getDeepDiveService(batchId: number, limit: number){
  //Configure HTTP Headers
  var headers = this.setToken();

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
      return data;
    })
  }
  getDeepDiveArticleService(articleID){
  //Configure HTTP Headers
  var headers = this.setToken();
  var callURL = this._apiUrl+'/'+ 'article/' + articleID;
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      return data;
    })
  }

  getDeepDiveVideoService(articleID){
  //Configure HTTP Headers
  var headers = this.setToken();
  var callURL = this._apiUrl+'/'+ 'article/video/'+ articleID;
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      return data;
    })
  }

  getDeepDiveVideoBatchService(limit, startNum, state?){
  //Configure HTTP Headers
  var headers = this.setToken();

  if(startNum == null){
    startNum = 1;
  }
  if(state == null){//make sure it comes back as a string of null if nothing is returned or sent to parameter
    state = 'null';
  }
  var callURL = this._apiUrl+'/'+ 'article/video/batch/division/'+state+'/'+ startNum +'/' + limit ;
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      return data;
    })
  }
  getDeepDiveBatchService(limit, startNum, state?){
  //Configure HTTP Headers
  var headers = this.setToken();

  if(startNum == null){
    startNum = 1;
  }
  if(state == null){//make sure it comes back as a string of null if nothing is returned or sent to parameter
    state = 'null';
  }
  var callURL = this._apiUrl+'/article'+ '/batch/division/'+state+'/'+startNum+'/'+limit;
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {

      return data;
    })
  }
  getdeepDiveData(deepDiveData, callback:Function, dataParam) {
  if(deepDiveData == null){
    deepDiveData = {};

  }else {
    }
  }


  getAiArticleData(state){
    var headers = this.setToken();
    //this is the sidkeick url
    var callURL = this._articleUrl + "sidekick-regional/"+ state +"/1/1";
    // console.log(callURL);
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        return data;
      });
  }
  getRecArticleData(region, pageNum, pageCount){
    var headers = this.setToken();
    //this is the sidkeick url
    var callURL = this._recUrl + "/" + region + "/" + pageNum + "/" + pageCount;
    // console.log(callURL);
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        return data;
      });
  }

getCarouselData(data, limit, batch, state, callback:Function) {
    //always returns the first batch of articles
       this.getDeepDiveBatchService(limit, batch, state)
       .subscribe(data=>{
         var transformedData = this.carouselTransformData(data.data);
        callback(transformedData);
       })
   }

 carouselTransformData(arrayData){
      var transformData = [];
      arrayData.forEach(function(val,index){
        let carData = {
          image_url: GlobalSettings.getImageUrl(val['imagePath']),
          title:  "<span> Today's News </span>" + val['title'],
          keyword: val['keyword'],
          teaser: val['teaser'].substr(0,250).replace('_',': ').replace(/<p[^>]*>/g, "") + "...",
          id:val['id'],
          articlelink: MLBGlobalFunctions.formatSynRoute('story', val.id),
        };
        transformData.push(carData);
      });
      return transformData;
  }

  transformToArticleRow(data){
    var articleStackArray = [];
    var sampleImage = "/app/public/placeholder_XL.png";
    var articleStackArray = [];
    data = data.data.slice(1,9);
    data.forEach(function(val, index){
      var date = GlobalFunctions.formatDate(val.publishedDate);
      var s = {
          stackRowsRoute: MLBGlobalFunctions.formatSynRoute('story', val.id),
          keyword: val.keyword,
          publishedDate: date.month + " " + date.day + ", " + date.year,
          provider1: val.author,
          provider2: "Published By: " + val.publisher,
          description: val.title,
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
  transformTileStack(data) {
    data = data.data;
    var lines = ['Find Your <br> Favorite Player', 'Find Your <br> Favorite Team', 'Check Out The Latest <br> With the MLB'];
    let pickATeam = ['Pick-team-page'];
    let mlbPage = ['MLB-page'];
    var tileLink = [pickATeam, pickATeam, mlbPage];
    var dataStack = [];
      for(var i = 0; i < 3; i++){
        var j = Math.floor(Math.random() * data.length);
        dataStack[i] = data[i];
        dataStack[i]['lines'] = lines[i];
        dataStack[i]['tileLink'] = tileLink[i];
        dataStack[i]['image_url'] = GlobalSettings.getImageUrl(data[j]['imagePath']) != null ? GlobalSettings.getImageUrl(data[j]['imagePath']) : "/app/public/placeholder_XL.png";
      }
      return dataStack;
  }
  transformToArticleStack(data){
    var sampleImage = "/app/public/placeholder_XL.png";
    var topData = data.data[0];
    var date = GlobalFunctions.formatDate(topData.publishedDate);
    var limitDesc = topData.teaser.substring(0, 360);//provided by design to limit characters
    var articleStackData = {
        articleStackRoute: MLBGlobalFunctions.formatSynRoute('story', topData.id),
        keyword: topData.keyword,
        date: date.month + " " + date.day + ", " + date.year,
        headline: topData.title,
        provider1: topData.author,
        provider2: "Published By: " + topData.publisher,
        description: limitDesc,
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
  transformTrending (data) {
    data.forEach(function(val,index){
      let date = GlobalFunctions.formatDate(val.publishedDate);
      val["date"] = date.month + " " + date.day + ", " + date.year + " " + date.time + " " + date.a + " EST";
      val["image"] = GlobalSettings.getImageUrl(val.imagePath);
    })
    return data;
  }
}