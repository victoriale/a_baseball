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
  var callURL = this._apiUrl+'/'+ 'article/video/batch/division/' + state + '/' + startNum + '/' + limit ;
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
  getDeepDiveAiBatchService(state?){
  //Configure HTTP Headers
  var headers = this.setToken();


  if(state == null){//make sure it comes back as a string of null if nothing is returned or sent to parameter
    state = 'null';
  }
  var callURL = this._articleUrl+'recent-games/'+state;
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {

      return data;
    })
  }
  getDeepDiveAiHeavyBatchService(state?){
  //Configure HTTP Headers
    state = state.toUpperCase();
  var headers = this.setToken();


  if(state == null){
    state = 'CA';
  }
  var callURL = this._articleUrl+'player-comparisons/'+state;
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
        var curdate = new Date();
        var curmonthdate = curdate.getDate();
        var date = GlobalFunctions.formatDate(val.publishedDate);
        let carData = {
          image_url: GlobalSettings.getImageUrl(val['imagePath']),
          title:  "<span> Today's News </span>" + val['title'],
          keyword: val['keyword'],
          teaser: val['teaser'].substr(0,200).replace('_',': ').replace(/<p[^>]*>/g, ""),
          id:val['id'],
          articlelink: MLBGlobalFunctions.formatSynRoute('story', val.id),
          date: date.day,
        };
        transformData.push(carData);

      });

      return transformData;
  }

  transformToArticleRow(data){
    var sampleImage = "/app/public/placeholder_XL.png";
    var articleStackArray = [];
    data = data.data.slice(1,9);
    data.forEach(function(val, index){
      var date = GlobalFunctions.formatDate(val.publishedDate);
      var s = {
          stackRowsRoute: MLBGlobalFunctions.formatSynRoute('story', val.id),
          keyword: val.keyword,
          publishedDate: date.month + " " + date.day + ", " + date.year,
          provider1: val.author != null ? val.author : "",
          provider2: val.publisher != null ? "Published By: " + val.publisher : "",
          description: val.title,
          images:  val.imagePath != null ? GlobalSettings.getImageUrl(val.imagePath) : sampleImage,
          imageConfig: {
            imageClass: "image-100x56",
            imageUrl: val.imagePath != null ? GlobalSettings.getImageUrl(val.imagePath) : sampleImage,
            hoverText: "View",
            urlRouteArray: MLBGlobalFunctions.formatSynRoute('story', val.id)
          }
      }
      articleStackArray.push(s);
    });
    return articleStackArray;
  }
  transformToAiArticleRow(data){
    var sampleImage = "/app/public/placeholder_XL.png";
    var articleStackArray = [];
    data.forEach(function(val, index){
      if (val.length != 0) {
      var date = GlobalFunctions.formatDate(val.timestamp*1000);
      var s = {
          stackRowsRoute: MLBGlobalFunctions.formatAiArticleRoute('postgame-report', val.event),
          keyword: 'POST GAME REPORT',
          publishedDate: date.month + " " + date.day + ", " + date.year,
          provider1: '',
          provider2: '',
          description: val.featuredReport['postgame-report'].displayHeadline,
          imageConfig: {
          imageClass: "image-100x56",
          hoverText: "View",
          imageUrl: val.home.images[0] != null ? val.home.images[0] : sampleImage,
          urlRouteArray: MLBGlobalFunctions.formatAiArticleRoute('postgame-report', val.event)
          }
      }
      articleStackArray.push(s);
    }
    });
    return articleStackArray;
  }
  transformToAiHeavyArticleRow(data){
    var sampleImage = "/app/public/placeholder_XL.png";
    var articleStackArray = [];
    var date = GlobalFunctions.formatDate(data.timestamp*1000);
    var i = 1;
    for (var key in data) {
      if (data.hasOwnProperty(key) && data[key].displayHeadline != null && i <= 8) {
        var s = {
            stackRowsRoute: MLBGlobalFunctions.formatAiArticleRoute(key, data.eventId),
            keyword: 'PLAYER COMPARISON',
            publishedDate: date.month + " " + date.day + ", " + date.year,
            provider1: '',
            provider2: '',
            description: data[key].displayHeadline,
            imageConfig: {
              imageClass: "image-100x56",
              imageUrl: data[key].image != null ? data[key].image : sampleImage,
              hoverText: "View",
              urlRouteArray: MLBGlobalFunctions.formatAiArticleRoute(key, data.eventId)
            }
        }
        articleStackArray.push(s);
        i = i + 1;
      }
    }
    return articleStackArray;
  }


  transformToArticleStack(data){
    var sampleImage = "/app/public/placeholder_XL.png";
    var topData = data.data[0];
    var date = topData.publishedDate != null ? GlobalFunctions.formatDate(topData.publishedDate) : null;
    var limitDesc = topData.teaser.substring(0, 360);//provided by design to limit characters
    var articleStackData = {
        articleStackRoute: MLBGlobalFunctions.formatSynRoute('story', topData.id),
        keyword: topData.keyword,
        date: date != null ? date.month + " " + date.day + ", " + date.year: "",
        headline: topData.title,
        provider1: topData.author != null ? "<span style='font-weight: 400;'>By</span> " + topData.author : "",
        provider2: topData.publisher != null ? "Published By: " + topData.publisher : "",
        description: limitDesc,
        imageConfig: {
          imageClass: "image-320x180",
          imageUrl: topData.imagePath != null ? GlobalSettings.getImageUrl(topData.imagePath) : sampleImage,
          hoverText: "View Article",
          urlRouteArray: MLBGlobalFunctions.formatSynRoute('story', topData.id)
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
    for(var i = 0; i < 6; i++){
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
    return ret;
  }

  transformTrending (data, currentArticleId) {
    data.forEach(function(val,index){
      //if (val.id != currentArticleId) {
      let date = GlobalFunctions.formatDate(val.publishedDate);
      val["date"] = date.month + " " + date.day + ", " + date.year + " " + date.time + " " + date.a + " EST";
      val["image"] = GlobalSettings.getImageUrl(val.imagePath);
      val["newsRoute"] = MLBGlobalFunctions.formatNewsRoute(val.id);
      //}
    })
    return data;
  }
  transformTileStack(data) {
    data = data.data;
    var lines = ['Find Your <br> Favorite Player', 'Find Your <br> Favorite Team', 'Check Out The Latest <br> With the MLB'];
    let pickATeam = ['Pick-team-page'];
    let mlbPage = ['MLB-page'];
    var tileLink = [pickATeam, pickATeam, mlbPage];
    var dataStack = [];
    // create array of imagePaths
    var imagePaths = [];
    for (var i=0; i<data.length; i++) {
      imagePaths.push(data[i].imagePath);
    }
    // remove duplicates from array
    var imagePaths = imagePaths.filter( function(item, index, inputArray) {
      return inputArray.indexOf(item) == index;
    });

    for(var i = 0; i < 3; i++){
      var k = imagePaths[Math.floor(Math.random() * imagePaths.length)];
      var indexOfK = imagePaths.indexOf(k);
      dataStack[i] = data[i];
      dataStack[i]['lines'] = lines[i];
      dataStack[i]['tileLink'] = tileLink[i];
      dataStack[i]['image_url'] = GlobalSettings.getImageUrl(k) != null ? GlobalSettings.getImageUrl(k) : "/app/public/placeholder_XL.png";
      // remove appended image string from array
      imagePaths.splice(indexOfK,1);
    }
    return dataStack;
  }
}
