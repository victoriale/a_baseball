import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';

declare var moment;
@Injectable()
export class DeepDiveService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  // private _apiToken: string = 'BApA7KEfj';
  // private _headerName: string = 'X-SNT-TOKEN';

  constructor(public http: Http){
  }

  //Function to set custom headers
  setToken(){
      var headers = new Headers();
      //headers.append(this.headerName, this.apiToken);
      return headers;
  }

  getDeepDiveService(){//DATE
  //Configure HTTP Headers
  var headers = this.setToken();


  //date needs to be the date coming in AS EST and come back as UTC
  var callURL = this._apiUrl+'/'+ 'article/batch/2/25';

  // console.log(callURL);
  return this.http.get(callURL, {headers: headers})
   .map(res => res.json())
   .map(data => {
     // transform the data to YYYY-MM-DD objects from unix
   //  console.log(data);
     return data.data

   })
 }
  getdeepDiveData(deepDiveData, callback:Function, dataParam) {
  if(deepDiveData == null){
    deepDiveData = {};

  }
  else {
  }
}
carouselTransformData(arrayData){
    // for(var i = 0; i < carouselData.length; i++){
    //   carouselData[i]['image_url'] = GlobalSettings.getImageUrl(carouselData[i]['imagePath']);
    //   carouselData[i]['title'] = carouselData[i]['title'];
    // }
      var transformData = [];
      arrayData.forEach(function(val,index){
      //  console.log(val);
        let carData = {
          image_url: GlobalSettings.getImageUrl(val['imagePath']),
          title:  "<span> Today's News </span>" + val['title'],
          keyword: val['keyword'],
          teaser: val['teaser'].substr(0,300) + "..."
        };
        transformData.push(carData);
      });

      return transformData;
  }
​
  stackrowsTransformData(data){
    console.log(data);
     var stackarray = [];
     data = data;
        for(var i = 0; i <=5; i++) {
          stackarray[i] = {};
          stackarray[i]['image_url'] = GlobalSettings.getImageUrl(data[i]['imagePath']);
          stackarray[i]['title'] = data[i]['title'];
          stackarray[i]['keyword'] = data[i]['keyword'];
          stackarray[i]['teaser'] = data[i]['teaser'].substr(0,300) + "...";
          stackarray[i]['publishedDate'] =  data[i]['publishedDate'];
          stackarray[i]['publisher'] = data[i]['publisher'];
          stackarray[i]['author'] = data[i]['author'];
          console.log(i);
    }
    return stackarray;
  }

​
​
​
​
  getCarouselData(data, callback:Function) {
      this.getDeepDiveService()
      .subscribe(data=>{
      //   console.log('before',data);
        var transformedData = this.carouselTransformData(data);
      //    console.log('after',transformedData);
      //  callback(transformedData);
      })
  }

  // getStackRowsData(data) {
  //     this.getDeepDiveService()
  //     .subscribe(data=>{
  //         console.log('before',data);
  //         var transformedData = this.stackrowsTransformData(data);
  //        //console.log('after',transformedData);
  //     })
  // }


}
